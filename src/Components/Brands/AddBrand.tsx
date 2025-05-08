import AddEntityPage from "../ReusablePages/AddEntityPage";
import { FormField } from "../Common/CustomForm";
import { addBrand } from "../../Services/brandsService";
import { allRoutes } from "../../Routes/AllRoutes";

const AddBrand = () => {
  // const [brandOptions, setBrandOptions] = useState<
  //   { value: string; text: string; picture?: string }[]
  // >([]);

  // useEffect(() => {
  //   const fetchBrands = async () => {
  //     const brands: any = await getAllBrands();
  //     const options = brands.map((brand: any) => ({
  //       value: brand._id,
  //       text: brand.name,
  //       picture: brand.picture,
  //     }));
  //     setBrandOptions(options);
  //   };
  //   fetchBrands();
  // }, []);

  const fields: FormField[] = [
    {
      label: "Brand Photo",
      placeholder: "This will be displayed on the profile of Brand",
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
      entityType='Brand'
      fields={fields}
      addFn={addBrand}
      backRoute={allRoutes.BRANDS}
    />
  );
};

export default AddBrand;
