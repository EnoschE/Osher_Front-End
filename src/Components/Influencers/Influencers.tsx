import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import TableBlock from "../Common/Table/TableBlock";
import CustomTableOptions from "../Common/CustomTableOptions";
import { useNavigate } from "react-router-dom";
import AvatarWithName from "../Common/AvatarWithName";
import { getAllInfluencers } from "../../Services/influencersService";

const Influencers = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Array<any>>([]);

  const tableHeaders = [
    {
      text: "Influencer",
      key: "name",
      customComponent: (props: { picture: string; name: string }) => (
        <AvatarWithName picture={props.picture} name={props.name} />
      ),
    },
    {
      text: "Email address",
      key: "email",
      showEllipses: true,
      maxWidth: 130,
      sortable: true,
    },
    {
      text: "Address",
      key: "address",
      showEllipses: true,
      maxWidth: 130,
      sortable: true,
    },
    {
      text: "Phone",
      key: "phone",
      sortable: true,
    },
    {
      text: "",
      key: "name",
      align: "right",
      notClickable: true,
      customComponent: (props: { _id: string }) => (
        <CustomTableOptions
          menuOptions={[
            {
              text: "Edit Influencer",
              onClick: () => {
                navigate(allRoutes.EDIT_INFLUENCER.replace(":id", props._id));
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
      const data: any = await getAllInfluencers();
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
        heading='Influencers'
        subHeading='These are all the influencers'
        tableData={data}
        addButtonText='Add Influencer'
        addButtonPath={allRoutes.ADD_INFLUENCER}
        detailsPagePath={allRoutes.VIEW_INFLUENCER}
        tableHeaders={tableHeaders}
        emptyStateMessage='There are no influencers present. Please add an influencer.'
        rowsPerPage={10}
      />
    </PageLayout>
  );
};

export default Influencers;
