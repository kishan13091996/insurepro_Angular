using Insurance.Api;


    public interface IUserRepository
    {
        User? GetUser(string username);

        void UpdateUser(User user);
        User? GetUserByRefreshToken(string refreshToken);
    }

