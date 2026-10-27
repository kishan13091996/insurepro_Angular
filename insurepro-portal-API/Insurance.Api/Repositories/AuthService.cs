using Insurance.Api;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using System.Text;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(
        IUserRepository userRepository,
        IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public LoginResponseDto Login(LoginRequestDto request)
    {
        var user = _userRepository.GetUser(request.Username);

        if (user == null || user.password != request.Password)
            throw new UnauthorizedAccessException("Invalid username or password.");

        var accessToken = GenerateAccessToken(user);
        var refreshToken = GenerateRefreshToken();

        user.refreshToken = refreshToken;
        user.refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        _userRepository.UpdateUser(user);

        return new LoginResponseDto
        {
            AccessToken = accessToken,
            //RefreshToken = refreshToken,
            Role = user.role,
            Expiration = DateTime.UtcNow.AddMinutes(15)
        };
    }

    public RefreshTokenResult RefreshToken(string refreshToken)
    {
        var user = _userRepository.GetUserByRefreshToken(refreshToken);

        if (user == null || user.refreshTokenExpiry <= DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException("Invalid or expired refresh token.");
        }

        var newAccessToken = GenerateAccessToken(user);
        var newRefreshToken = GenerateRefreshToken();
        var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        user.refreshToken = newRefreshToken;
        user.refreshTokenExpiry = refreshTokenExpiry;
        _userRepository.UpdateUser(user);

        return new RefreshTokenResult
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            Role = user.role,
            Expiration = DateTime.UtcNow.AddMinutes(15),
            RefreshTokenExpiry = refreshTokenExpiry
        };
    }

    private string GenerateAccessToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.username),
            new Claim(ClaimTypes.Role, user.role)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(1),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        var randomBytes = RandomNumberGenerator.GetBytes(64);

        return Convert.ToBase64String(randomBytes);
    }


}