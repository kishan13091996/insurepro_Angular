# Angular Component Architecture

```mermaid
flowchart TD

    App[AppComponent]

    App --> Header[Header]
    App --> Sidebar[Sidebar]
    App --> Router[Router Outlet]

    Router --> Dashboard[Dashboard]
    Router --> Customers[Customers]
    Router --> Policies[Policies]
    Router --> Claims[Claims]