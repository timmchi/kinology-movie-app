import { useState } from "react";

const UserUpdateForm = ({ updateUser }) => {
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");

  // TODO - learn how to process images! Add to back-end? Use AWS? Implement Drag N Drop?
  const [avatar, setAvatar] = useState("");

  const updatingUser = (event) => {
    event.preventDefault();
    updateUser({
      biography: bio,
      name: name,
      avatar: avatar,
    });

    setBio("");
    setName("");
    setAvatar("");
  };

  return (
    <form onSubmit={updatingUser}>
      <div>
        About you
        <input
          placeholder="Write something about yourself"
          onChange={({ target }) => setBio(target.value)}
          value={bio}
        />
      </div>
      <div>
        Avatar
        <input
          placeholder="Link to your avatar"
          onChange={({ target }) => setAvatar(target.value)}
          value={avatar}
        />
      </div>
      <div>
        Name
        <input
          placeholder="Set your name"
          onChange={({ target }) => setName(target.value)}
          value={name}
        />
      </div>
      <button type="submit">Change your profile</button>
    </form>
  );
};

export default UserUpdateForm;
