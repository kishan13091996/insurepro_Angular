namespace Insurance.Api;

public class Customer
{
    public int id { get; set; }

    public string customerNumber { get; set; } = "";

    public string name { get; set; } = "";

    public string email { get; set; } = "";

    public string phone { get; set; } = "";

    public string status { get; set; } = "";
}
