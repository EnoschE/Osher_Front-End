import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import TableBlock from "../Common/Table/TableBlock";
import CustomTableOptions from "../Common/CustomTableOptions";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import AvatarWithName from "../Common/AvatarWithName";
import { getAllPosts } from "../../Services/postsService";

export const commonPostsTableHeaders = [
  {
    text: "Post",
    key: "name",
    customComponent: (props: { picture: string; name: string }) => (
      <AvatarWithName isSquarish name={props.name} picture={props.picture} />
    ),
  },
  {
    text: "Description",
    key: "description",
    showEllipses: true,
    maxWidth: 130,
  },
  {
    text: "Influencer",
    key: "userName",
    sortable: true,
  },
  {
    text: "Publish Date",
    key: "publishDate",
    sortable: true,
    customComponent: (props: { publishDate: string }) =>
      moment(props.publishDate).format("LL"),
  },
];

const Posts = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Array<any>>([]);

  const tableHeaders = [
    ...commonPostsTableHeaders,
    {
      text: "",
      key: "name",
      align: "right",
      notClickable: true,
      customComponent: (props: { _id: string }) => (
        <CustomTableOptions
          menuOptions={[
            {
              text: "Edit Post",
              onClick: () => {
                navigate(allRoutes.EDIT_POST.replace(":id", props._id));
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
      const data: any = await getAllPosts();

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
        heading="Posts"
        subHeading="These are all the posts"
        tableData={data}
        addButtonText="Add post"
        addButtonPath={allRoutes.ADD_POST}
        detailsPagePath={allRoutes.VIEW_POST}
        tableHeaders={tableHeaders}
        emptyStateMessage="There are no posts present. Please add a post."
        rowsPerPage={10}
      />
    </PageLayout>
  );
};

export default Posts;
