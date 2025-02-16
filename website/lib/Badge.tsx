import Image from "@lib/Image";

export const Badge = ({ path, label = "", extra = "" }) => {
  const getURL = (color) =>
    `https://img.shields.io/${path}?style=flat-square&labelColor=${color}&color=${color}${extra ? "&" + extra : ""}`;

  return (
    <>
      <Image
        alt={label}
        className="hide-on-light"
        src={getURL("rgba(0%2C0%2C0%2C0)")}
        unoptimized={true}
      />
      <Image
        alt={label}
        className="hide-on-dark"
        src={getURL("rgba(255%2C255%2C255%2C0)")}
        unoptimized={true}
      />
    </>
  );
};

export default Badge;
