import { Outlet, useLocation } from 'react-router-dom';
import { Menu as AntdMenu, MenuProps } from 'antd';

import { router } from '../../App';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: '会议室列表',
  },
  {
    key: '2',
    label: '预定历史',
  },
];

const handleMenuItemClick: MenuProps['onClick'] = info => {
  let path = '';
  switch (info.key) {
    case '1':
      path = '/meeting_room_list';
      break;
    case '2':
      path = '/booking_history';
      break;
  }
  router.navigate(path);
};

const Menu = () => {
  const location = useLocation();

  function getSelectedKeys() {
    if (location.pathname === '/meeting_room_list') {
      return ['1'];
    } else if (location.pathname === '/booking_history') {
      return ['2'];
    } else {
      return ['1'];
    }
  }

  return (
    <div id="menu-container" className="flex flex-row h-full">
      <div className="w-200">
        <AntdMenu
          defaultSelectedKeys={getSelectedKeys()}
          items={items}
          onClick={handleMenuItemClick}
          className="h-full"
        />
      </div>
      <div className="flex-1 p-5">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Menu;
