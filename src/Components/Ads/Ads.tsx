import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import TableBlock from "../Common/Table/TableBlock";
import CustomTableOptions from "../Common/CustomTableOptions";
import { useNavigate } from "react-router-dom";
import { getAllAds } from "../../Services/adsService";
import moment from "moment";
import AvatarWithName from "../Common/AvatarWithName";

export const commonAdsTableHeaders = [
  {
    text: "Ad",
    key: "name",
    customComponent: (props: { picture: string; name: string }) => (
      <AvatarWithName isSquarish name={props.name} picture={props.picture} />
    ),
  },
  {
    text: "Category",
    key: "categoryName",
    showEllipses: true,
    maxWidth: 130,
    sortable: true,
  },
  {
    text: "Brand",
    key: "brand",
    sortable: true,
    customComponent: (props: { brandName: string }) => props.brandName,
  },
  {
    text: "Publish Date",
    key: "publishDate",
    sortable: true,
    customComponent: (props: { publishDate: string }) =>
      moment(props.publishDate).format("LL"),
  },
  {
    text: "Expiry Date",
    key: "expiryDate",
    sortable: true, // DO THE SAME LOGIC FOR DATES HERE AS WELL LIKE IN PAGEDETAILSBLOCK
    customComponent: (props: { expiryDate: string }) =>
      moment(props.expiryDate).format("LL"),
  },
];

const Ads = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Array<any>>([]);

  const tableHeaders = [
    ...commonAdsTableHeaders,
    {
      text: "",
      key: "name",
      align: "right",
      notClickable: true,
      customComponent: (props: { _id: string }) => (
        <CustomTableOptions
          menuOptions={[
            {
              text: "Edit Ad",
              onClick: () => {
                navigate(allRoutes.EDIT_AD.replace(":id", props._id));
              },
            },
          ]}
        />
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const data: any = await getAllAds();
      setData(data);
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  return (
    <PageLayout hideBackButton>
      <TableBlock
        isLoading={loading}
        heading='Ads'
        subHeading='These are all the ads'
        tableData={data}
        addButtonText='Add ad'
        addButtonPath={allRoutes.ADD_AD}
        detailsPagePath={allRoutes.VIEW_AD}
        tableHeaders={tableHeaders}
        emptyStateMessage='There are no ads present. Please add an ad.'
        rowsPerPage={10}
      />
    </PageLayout>
  );
};

export default Ads;
