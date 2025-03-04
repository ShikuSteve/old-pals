
import { Person } from "react-bootstrap-icons";

interface AvatarProps {
  src?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ src, size = 50 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: "rgb(204, 204, 204)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {src ? (
        <img
          src={src}
          alt="Avatar"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <Person size={size * 0.6} color="#888" />
      )}
    </div>
  );
};

export default Avatar;
