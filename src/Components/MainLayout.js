import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import React, { useState } from "react";
import {
  AiOutlineDashboard,
  AiOutlineShoppingCart,
  AiOutlineBranches,
  AiOutlineTrademarkCircle,
  AiOutlineUserSwitch,
  AiOutlineOrderedList,
} from "react-icons/ai";
import { CiDiscount1 } from "react-icons/ci";
import { VscChecklist } from "react-icons/vsc";
import { BsExclamationCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router";
import { Outlet } from "react-router";
import { Avatar } from "@mui/material";
import { usePopover } from "../hooks/use-popover";
import { AccountPopover } from "../Components/account-popover";
import Notifications from "./notifications";
import { auth } from "../Config/FirebaseConfig";
const { Header, Sider, Content } = Layout;
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const accountPopover = usePopover();
  const user = auth.currentUser.toJSON();
  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ minWidth: "100vh" }}
      >
        <div className="logo">
          <h2 className="text-white fs-5 text-center py-3">
            <span className="sm-logo"><img src="../src/assets/logo.png" alt="logo"/></span>
            <span className="lg-logo">Shopinet Admin</span>
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[""]}
          onClick={({ key }) => {
            if (key === "signout") {
            } else {
              navigate(key);
            }
          }}
          items={[
            {
              key: "",
              icon: <AiOutlineDashboard className="fs-4" />,
              label: "Dashboard",
            },
            {
              key: "produits",
              icon: <AiOutlineShoppingCart className="fs-4" />,
              label: "Produits",
              children: [
                {
                  key: "liste-produit",
                  icon: <AiOutlineOrderedList className="fs-4" />,
                  label: "Liste produits",
                },
              ],
            },
            {
              key: " sous catégories",
              icon: <AiOutlineBranches className="fs-4" />,
              label: "Sous Catégories",
              children: [
                {
                  key: "liste-Categorie",
                  icon: <AiOutlineOrderedList className="fs-4" />,
                  label: "Liste sous catégories",
                }
              ],
            },
            {
              key: "marques",
              icon: <AiOutlineTrademarkCircle className="fs-4" />,
              label: "Marques",
              children: [
                {
                  key: "liste-marque",
                  icon: <AiOutlineOrderedList className="fs-4" />,
                  label: "Liste marque",
                },
              ],
            },
            {
              key: "utilisateurs",
              icon: <AiOutlineUserSwitch className="fs-4" />,
              label: "Utilisateurs",
              children: [
                {
                  key: "liste-admin",
                  icon: <AiOutlineOrderedList className="fs-4" />,
                  label: "Liste admins",
                },
                {
                  key: "liste-utilisateurs",
                  icon: <AiOutlineOrderedList className="fs-4" />,
                  label: "Liste utilisateurs",
                },
              ],
            },
            {
              key: "offres",
              icon: <CiDiscount1 className="fs-4" />,
              label: "Offres",
              children: [
                {
                  key: "Liste-offre",
                  icon: <AiOutlineOrderedList className="fs-4" />,
                  label: "Liste Offres",
                },
              ],
            },
            {
              key: "commandes",
              icon: <VscChecklist className="fs-4" />,
              label: "Commandes",
              children: [
                {
                  key: "liste-commande",
                  icon: <AiOutlineOrderedList className="fs-4" />,
                  label: "Liste  commandes",
                },
              ],
            },
            {
              key: "réclamations",
              icon: <BsExclamationCircleFill className="fs-4" />,
              label: "Réclamation",
              children: [
                {
                  key: "liste-reclamation",
                  icon: <AiOutlineOrderedList className="fs-4" />,
                  label: "Liste  réclamations",
                },
              ],
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
          className="d-flex justify-content-between ps-3 pe-5"
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className="d-flex gap-3 align-items-center">
            <div  className="position-relative">
            <Notifications   />
            </div>
          
            <div className="d-flex gap-3 align-items-center">
              <div>
                <Avatar
                  onClick={accountPopover.handleOpen}
                  ref={accountPopover.anchorRef}
                  sx={{
                    cursor: "pointer",
                    height: 40,
                    width: 40,
                  }}
                  src={user.photoURL}
                />
                <AccountPopover
                  anchorEl={accountPopover.anchorRef.current}
                  open={accountPopover.open}
                  onClose={accountPopover.handleClose}
                />
              </div>
              <div>
                <h5 className="mb-0">{user.displayName}</h5>
                <p className="mb-0"> {user.email}</p>
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
