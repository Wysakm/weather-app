import React from "react";
import '../styles-pages/postsTable.css';
import PostsTable from "../../components/admin/PostsTable";

const Posts = () => {
  return (
    <div className="postManage-container">
      <PostsTable />
    </div>
  );
}
export default Posts;