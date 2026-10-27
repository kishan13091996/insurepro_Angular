using System.Text.Json;
using Insurance.Api;

public class UserRepository : IUserRepository
{
    private readonly string _filePath;

    public UserRepository(IWebHostEnvironment environment)
    {
        _filePath = Path.Combine(environment.ContentRootPath, "Data", "users.json");
    }

    public User? GetUser(string username)
    {
        var users = GetUsers();

        return users.FirstOrDefault(x =>
            x.username.Equals(username, StringComparison.OrdinalIgnoreCase));
    }

    public void UpdateUser(User user)
    {
        var users = GetUsers();

        var existingUser = users.First(x => x.id == user.id);

        existingUser.refreshToken = user.refreshToken;
        existingUser.refreshTokenExpiry = user.refreshTokenExpiry;

        var json = JsonSerializer.Serialize(users, new JsonSerializerOptions
        {
            WriteIndented = true
        });

        File.WriteAllText(_filePath, json);
    }

    public User? GetUserByRefreshToken(string refreshToken)
    {
        var users = GetUsers();

        return users.FirstOrDefault(x =>
            x.refreshToken == refreshToken);
    }

    private List<User> GetUsers()
    {
        var json = File.ReadAllText(_filePath);

        return JsonSerializer.Deserialize<List<User>>(json)!;
    }
}