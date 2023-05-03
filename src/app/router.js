import { createBrowserRouter } from "react-router-dom";
import ContactCard from "./views/contacts/contactCard";
import Index from "app/views";
import CustomerList from "./views/customer";
import Opportunities from "app/views/opportunities";
import LeadList from "app/views/Leads";
import LeadForm from "./views/Leads/addleads";
import CustomerForm from "./views/customer/addcustomer";
import Contactform from "./views/contacts/addcontact";
import Addopportunities from "./views/opportunities/addopportunities";
import Opportunitielist from "./views/opportunities/opportunitielist";
import ContactList from "./views/contacts/contactList";
import CustomerCard from "./views/customer/customercard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    children: [
      {
        path: "leads",

        children: [
          { index: true, element: <LeadList /> },
          { path: "new", element: <LeadForm /> },
          {
            path: ":id",
            element: <LeadForm />,
          },
        ],
      },

      {
        path: "customer",

        children: [
          { index: true, element: <CustomerCard /> },
          { path: ":id", element: <CustomerForm /> },
          {
            path: "new",
            element: <CustomerForm />,
          },
          { path: "list", element: <CustomerList /> },
        ],
      },

      {
        path: "opportunities",
        children: [
          { index: true, element: <Opportunities /> },
          { path: "new", element: <Addopportunities /> },
          {
            path: ":id",
            element: <Addopportunities />,
          },
          {
            path: "list",
            element: <Opportunitielist />,
          },
        ],
      },
      {
        path: "contacts",

        children: [
          { index: true, element: <ContactCard /> },
          { path: "new", element: <Contactform /> },
          {
            path: ":id",
            element: <Contactform />,
          },
          { path: "list", element: <ContactList /> },
        ],
      },
    ],
  },
]);

export default router;
