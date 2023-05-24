import React from "react";
import Buttons from "./button";
import { useNavigate, useParams } from "react-router-dom";

const FooterButton = ({ handleSubmit, saving }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <>
      {id ? (
        <Buttons onClick={handleSubmit} saving={saving}>
          update
        </Buttons>
      ) : (
        <Buttons onClick={handleSubmit} saving={saving}>
          submit
        </Buttons>
      )}
      <Buttons onClick={() => navigate(-1)}>back</Buttons>
    </>
  );
};

export default FooterButton;
