import { Button } from "@mui/material";
import PropTypes from "prop-types";

const EditProfileButtons = ({ currentUser, user, updateForm, deleteUser }) => {
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
  currentUser: PropTypes.object,
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  updateForm: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
};
