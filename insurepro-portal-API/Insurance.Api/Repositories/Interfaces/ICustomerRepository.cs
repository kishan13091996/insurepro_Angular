using Insurance.Api;

public interface ICustomerRepository
{
    List<Customer> GetAll();

    Customer Create(Customer customer);

    Customer Update(Customer customer);

    void Delete(int id);
}