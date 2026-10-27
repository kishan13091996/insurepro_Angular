public class RefreshTokenResult
{
    public string AccessToken { get; set; } = string.Empty;

    public string RefreshToken { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;

    public DateTime Expiration { get; set; }

    public DateTime RefreshTokenExpiry { get; set; }
}