import { useState } from "react";
import { Form, Formik } from "formik";
import Modal from "@/components/modal/Modal";
import { IChangePassword } from "@/interface/auth/resetPasswordInterface";
import Button from "@/components/formComponents/button/Button";
import TextField from "@/components/formComponents/textField/TextField";
import { IconEye, IconEyeSlash } from "@/components/svgIcons";
import { ChangePasswordValidationSchema } from "@/validations/auth/ChangePasswordValidation";
import { ChangePasswordData } from "@/services/authService";

interface ChangePasswordModal {
  openModal: boolean;
  closeModal: () => void;
}

const defaultInitialValues = {
  oldPassword: "",
  password: "",
  confirmPassword: "",
};

const ChangePassword = ({ openModal, closeModal }: ChangePasswordModal) => {
  const [loader, setLoader] = useState(false);
  const [passwordShow, setPasswordShow] = useState({
    oldPassword: false,
    password: false,
    confirmPassword: false,
  });

  async function OnSubmit(data: IChangePassword) {
    setLoader(true);
    const params = {
      oldPassword: data.oldPassword,
      newPassword: data.password,
    };
    const response = await ChangePasswordData(params);
    const { responseData, response_type } = response.data;
    if (response_type === "success") {
      if (responseData) {
        closeModal();
      }
    }
    setLoader(false);
  }
  return (
    <>
      {openModal && (
        <Modal
          title="Change Password"
          width="max-w-[537px]"
          hideFooterButton={true}
          closeModal={closeModal}
        >
          <Formik
            initialValues={defaultInitialValues}
            validationSchema={ChangePasswordValidationSchema()}
            onSubmit={OnSubmit}
          >
            {() => (
              <Form>
                <div className="input-list-wrapper mt-4 text-left">
                  <div className="input-item">
                    <TextField
                      type={passwordShow.oldPassword ? "text" : "password"}
                      label="Old Password"
                      name="oldPassword"
                      parentClass={"mb-6"}
                      isCompulsory={true}
                      placeholder="Old Password"
                      icon={
                        <div
                          onClick={() =>
                            setPasswordShow({
                              ...passwordShow,
                              oldPassword: !passwordShow.oldPassword,
                            })
                          }
                          className="absolute right-4 top-10 rtl:left-4 rtl:right-auto cursor-pointer"
                        >
                          {passwordShow.oldPassword ? (
                            <IconEye />
                          ) : (
                            <IconEyeSlash />
                          )}
                        </div>
                      }
                    />
                  </div>
                  <div className="input-item">
                    <TextField
                      type={passwordShow.password ? "text" : "password"}
                      label="New Password"
                      name="password"
                      parentClass={"mb-6"}
                      isCompulsory={true}
                      placeholder="New Password"
                      icon={
                        <div
                          onClick={() =>
                            setPasswordShow({
                              ...passwordShow,
                              password: !passwordShow.password,
                            })
                          }
                          className="absolute right-4 top-10 rtl:left-4 rtl:right-auto cursor-pointer"
                        >
                          {passwordShow.password ? (
                            <IconEye />
                          ) : (
                            <IconEyeSlash />
                          )}
                        </div>
                      }
                    />
                  </div>
                  <div className="input-item">
                    <TextField
                      type={passwordShow.confirmPassword ? "text" : "password"}
                      label="Confirm Password"
                      name="confirmPassword"
                      parentClass={"mb-6"}
                      isCompulsory={true}
                      placeholder="Confirm Password"
                      icon={
                        <div
                          onClick={() =>
                            setPasswordShow({
                              ...passwordShow,
                              confirmPassword: !passwordShow.confirmPassword,
                            })
                          }
                          className="absolute right-4 top-10 rtl:left-4 rtl:right-auto cursor-pointer"
                        >
                          {passwordShow.confirmPassword ? (
                            <IconEye />
                          ) : (
                            <IconEyeSlash />
                          )}
                        </div>
                      }
                    />
                  </div>
                  <Button
                    variant={"primary"}
                    type="submit"
                    className="w-full mt-6 !text-base/6"
                    loader={loader}
                  >
                    Change Password
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </>
  );
};

export default ChangePassword;
