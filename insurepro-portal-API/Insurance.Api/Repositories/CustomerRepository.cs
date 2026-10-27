using System.Text.Json;
using Insurance.Api;

public class CustomerRepository : ICustomerRepository
{
    private readonly string _filePath = "Data/customers.json";

    public List<Customer> GetAll()
    {
        if (!File.Exists(_filePath))
            return [];

        var json = File.ReadAllText(_filePath);

        return JsonSerializer.Deserialize<List<Customer>>(json)
               ?? [];
    }

    public Customer Create(Customer customer)
    {
        var customers = GetAll();

        customer.id =
            customers.Any()
            ? customers.Max(x => x.id) + 1
            : 1;

        customers.Add(customer);

        Save(customers);

        return customer;
    }

    public Customer Update(Customer customer)
    {
        var customers = GetAll();

        var existing =
            customers.First(x => x.id == customer.id);

        existing.customerNumber = customer.customerNumber;
        existing.name = customer.name;
        existing.email = customer.email;
        existing.phone = customer.phone;
        existing.status = customer.status;

        Save(customers);

        return existing;
    }

    public void Delete(int id)
    {
        var customers = GetAll();

        customers.RemoveAll(x => x.id == id);

        Save(customers);
    }

    private void Save(List<Customer> customers)
    {
        var json =
            JsonSerializer.Serialize(
                customers,
                new JsonSerializerOptions
                {
                    WriteIndented = true
                });

        File.WriteAllText(
            _filePath,
            json);
    }
}