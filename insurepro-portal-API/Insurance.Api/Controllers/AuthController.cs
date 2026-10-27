using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;

namespace Insurance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IUserRepository _userRepository;
    private readonly IAuthService _authService;
    public AuthController(IConfiguration configuration, IUserRepository userRepository, IAuthService authService)
    {
        _configuration = configuration;
        _userRepository = userRepository;
        _authService = authService;
    }

    [HttpPost("login")]
    public IActionResult Login(LoginRequestDto request)
    {
        try
        {
            var user = _userRepository.GetUser(request.Username);
            if (user == null || user.password != request.Password)
            {
                return Unauthorized("Invalid username or password.");
            }

            var response = _authService.Login(request);
            user = _userRepository.GetUser(request.Username);
            Response.Cookies.Append("refreshToken", user.refreshToken,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = user.refreshTokenExpiry
                });

            return Ok(response);
        }
        catch
        {
            return Unauthorized("Authentication failed.");
        }
    }

    [HttpPost("refresh")]
    public IActionResult RefreshToken()
    {
        try
        {
            if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
            {
                return Unauthorized("Refresh token not found.");
            }

            var result = _authService.RefreshToken(refreshToken);

            Response.Cookies.Append("refreshToken", result.RefreshToken,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = result.RefreshTokenExpiry
                });

            return Ok(new LoginResponseDto
            {
                AccessToken = result.AccessToken,
                Role = result.Role,
                Expiration = result.Expiration
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
    }
}