import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiUsers,
  FiShoppingBag,
  FiTool,
  FiHome,
  FiDollarSign,
  FiCreditCard,
  FiUserCheck,
  FiSettings,
} from "react-icons/fi";
import { FaShopify } from "react-icons/fa";

interface MasterDataItem {
  title: string;
  icon: React.ReactElement;
  path: string;
  color: string;
}

const masterDataItems: MasterDataItem[] = [
  {
    title: "Account",
    icon: <FiUser className="w-8 h-8" />,
    path: "/admin/account",
    color: "#3b82f6",
  },
  {
    title: "Transfer",
    icon: <FiDollarSign className="w-8 h-8" />,
    path: "/admin/transfer",
    color: "#10b981",
  },
  {
    title: "Customer",
    icon: <FiUsers className="w-8 h-8" />,
    path: "/customer",
    color: "#8b5cf6",
  },
  {
    title: "Model",
    icon: <FiShoppingBag className="w-8 h-8" />,
    path: "/model",
    color: "#f59e0b",
  },
  {
    title: "Company",
    icon: <FiHome className="w-8 h-8" />,
    path: "/company",
    color: "#ef4444",
  },
  {

    title: "Shops",
    icon: <FaShopify className="w-8 h-8" />,
    path: "/shops",
    color: "#06b6d4",
  },
  {
    title: "Spare",
    icon: <FiSettings className="w-8 h-8" />,
    path: "/spare",
    color: "#f97316",
  },
  {
    title: "Works",
    icon: <FiTool className="w-8 h-8" />,
    path: "/works",
    color: "#ec4899",
  },
  {
    title: "Staff Details",
    icon: <FiUserCheck className="w-8 h-8" />,
    path: "/staff/details",
    color: "#6366f1",
  },
  {
    title: "Salary",
    icon: <FiCreditCard className="w-8 h-8" />,
    path: "/staff/salary",
    color: "#14b8a6",
  },
];

function MasterData() {
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} mb={4}>
        Master Data
      </Typography>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {masterDataItems.map((item, index) => (
          <Card
            key={index}
            onClick={() => handleCardClick(item.path)}
            sx={{
              cursor: "pointer",
              transition: "all 0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
              },
            }}
          >
            <CardContent>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                py={2}
              >
                <Box
                  sx={{
                    color: item.color,
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="h6" fontWeight={500} textAlign="center">
                  {item.title}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>
    </Box>
  );
}

export default MasterData;