import { Button } from "@mui/material";
import { useUserValue } from "../../contexts/UserContext";
import PropTypes from "prop-types";

const EditProfileButtons = ({ user, updateForm, deleteUser }) => {
  const currentUser = useUserValue();
  return (
    <div className="profileButtons">
      {currentUser && currentUser?.username === user.username && (
        <>
          {updateForm()}
          <Button
            sx={{
              backgroundColor: "#9b000a",
              "&:hover": { backgroundColor: "#730000" },
              alignSelf: "start",
            }}
            variant="contained"
            size="small"
            onClick={deleteUser}
          >
            Delete user
          </Button>
        </>
      )}
    </div>
  );
};

export default EditProfileButtons;

EditProfileButtons.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  updateForm: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
};
