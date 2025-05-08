import AddEntityPage from "../ReusablePages/AddEntityPage";
import { FormField } from "../Common/CustomForm";
import { allRoutes } from "../../Routes/AllRoutes";
import { addInfluencer } from "../../Services/influencersService";

const AddInfluencer = () => {
  const fields: FormField[] = [
    {
      label: "Influencer Photo",
      placeholder: "This will be displayed on the profile of Influencer",
      name: "picture",
      type: "image",
    },
    {
      required: true,
      label: "Name",
      name: "name",
    },
    {
      required: true,
      label: "Email",
      placeholder: "@example",
      name: "email",
      type: "email",
    },
    {
      required: true,
      label: "Address",
      name: "address",
    },
    {
      required: true,
      label: "Phone Number",
      name: "phone",
      type: "phone",
    },
    {
      required: true,
      label: "Password",
      placeholder: "********",
      name: "password",
      type: "password",
    },
    {
      required: true,
      label: "Confirm Password",
      placeholder: "********",
      name: "confirmPassword",
      type: "password",
    },
  ];

  return (
    <AddEntityPage
      entityType='Influencer'
      fields={fields}
      addFn={addInfluencer}
      backRoute={allRoutes.INFLUENCERS}
    />
  );
};

export default AddInfluencer;
