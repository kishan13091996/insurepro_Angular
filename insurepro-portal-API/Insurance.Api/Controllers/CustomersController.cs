using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Insurance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerRepository _repository;

    public CustomersController(
        ICustomerRepository repository)
    {
        _repository = repository;
    }
    [Authorize]
    [HttpGet("Get")]
    public IActionResult Get()
    {
        return Ok(
            _repository.GetAll()
        );
    }

    [Authorize]
    [HttpPost("Create")]
    public IActionResult Create(
        Customer customer)
    {
        return Ok(
            _repository.Create(customer)
        );
    }

    [Authorize]
    [HttpPut("{id}")]
    public IActionResult Update(
        int id,
        Customer customer)
    {
        customer.id = id;

        return Ok(
            _repository.Update(customer)
        );
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public IActionResult Delete(
        int id)
    {
        _repository.Delete(id);

        return NoContent();
    }
}