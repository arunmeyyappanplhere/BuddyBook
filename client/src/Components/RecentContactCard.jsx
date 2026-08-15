import defaultImage from "/default_avatar.png";
const RecentContactCard = ({
  contactName = "User",
  role = "User role",
  contactNumber = 1234567890,
  contactImage,
}) => {
  return (
    <div className="bg-[#f9f9f934] w-full shadow-xs rounded-sm flex gap-4 md:gap-10 items-center py-1 px-4 cursor-pointer">
      <img
        src={contactImage || defaultImage}
        alt=""
        className="size-12 md:size-15 rounded-full"
      />
      <div className="min-w-0">
        <h1 className="font-medium text-md truncate">{contactName}</h1>
        <h2 className="text-gray-500 text-sm text-wrap truncate">{role}</h2>
      </div>
      <h2 className="font-medium text-sm ml-auto text-nowrap">
        {contactNumber}
      </h2>
    </div>
  );
};

export default RecentContactCard;