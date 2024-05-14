import { useState } from "react";

const UserUpdateForm = ({ updateUser }) => {
  const [bio, setBio] = useState();
  const [name, setName] = useState("");

  // TODO - learn how to process images! Add to back-end? Use AWS? Implement Drag N Drop?
  const [avatar, setAvatar] = useState(null);

  const updatingUser = (event) => {
    event.preventDefault();
    console.log(avatar);

    const formData = new FormData();
    formData.append("avatar", avatar);
    formData.append("bio", bio);
    formData.append("name", name);

    console.log(formData.get("avatar"));
    updateUser(formData);

    setBio("");
    setName("");
    setAvatar(null);
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
          onChange={(e) => setAvatar(e.target.files[0])}
          type="file"
          accept="image/*"
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
