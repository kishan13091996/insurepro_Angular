using Insurance.Api;

public interface IAuthService
{
    LoginResponseDto Login(LoginRequestDto request);

    RefreshTokenResult RefreshToken(string refreshToken);
}