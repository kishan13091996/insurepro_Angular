public class User
{
    public int id { get; set; }

    public string username { get; set; } = string.Empty;

    public string password { get; set; } = string.Empty;

    public string role { get; set; } = string.Empty;

    public string refreshToken { get; set; } = string.Empty;

    public DateTime? refreshTokenExpiry { get; set; }
}