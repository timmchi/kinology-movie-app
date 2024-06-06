import PropTypes from "prop-types";

const UserInfo = ({ name, biography }) => {
  return (
    <>
      <h1>
        <strong>{name}</strong>
      </h1>
      <div>
        <h2>About me</h2>
        <p>
          {biography === ""
            ? "We don't know anything about them yet"
            : biography}
        </p>
      </div>
    </>
  );
};

export default UserInfo;

UserInfo.propTypes = {
  name: PropTypes.string.isRequired,
  biography: PropTypes.string.isRequired,
};
