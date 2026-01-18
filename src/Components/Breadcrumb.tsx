import { Link, useLocation } from "react-router-dom";
import { FiHome, FiChevronRight } from "react-icons/fi";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

function Breadcrumb({ items }: BreadcrumbProps) {
  const location = useLocation();

  // Auto-generate breadcrumbs from path if items not provided
  const getBreadcrumbsFromPath = () => {
    const pathSegments = location.pathname.split("/").filter((segment) => segment);
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", path: "/" }];

    let currentPath = "";
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      breadcrumbs.push({ label, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || getBreadcrumbsFromPath();

  return (
    <nav className="flex items-center gap-2 px-3 py-2 text-sm ">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {index === 0 && <FiHome className="w-4 h-4" />}
            
            {item.path && !isLast ? (
              <Link
                to={item.path}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-gray-700 font-medium" : "text-gray-600"}>
                {item.label}
              </span>
            )}

            {!isLast && <FiChevronRight className="w-4 h-4 text-gray-400" />}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
