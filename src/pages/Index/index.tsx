import { UserOutlined } from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';

const Index = () => {
  return (
    <div id="index-container" className="min-h-screen flex flex-col">
      <div className="flex items-center h-20 border-b border-solid border-gray-300 justify-between px-4">
        <h1 className="m-0 text-4xl">会议室预定系统</h1>
        <Link to={'/update_info'}>
          <UserOutlined className="text-4xl" />
        </Link>
      </div>
      <div className="flex-1">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Index;
