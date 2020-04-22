//Copia del componente home.js de Modu-Base

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { Button, Form, Grid, Header, Icon, Label, Message, Segment } from 'semantic-ui-react';
import api from '../../api';
import { useTranslation } from "react-i18next";
import './Login.css';

export default function Home() {
    const history = useHistory();
    const { t } = useTranslation();
    const [errorLogin, setErrorLogin] = useState(false);
    const { register, setValue, handleSubmit, errors, getValues } = useForm({
        defaultValues: {
            userName: "",
            userPass: "",
        }
    });

    function actionButtonSubmit() {
        let values = getValues();
        let body = {
            "username": values.userName,
            "password": values.userPass,
        }
        api.session(body).then((resp) => {
            if (resp.status == 200) {
                var dateExpiration = new Date();
                dateExpiration.setSeconds(resp.data.expiresIn);
                window.localStorage.setItem('expirationTokenLog', dateExpiration);
                window.localStorage.setItem('tokenLog', resp.data.token);
                api.setToken(resp.data.token);
                history.replace("/logged-test");
            } else {
                setErrorLogin(true);
            }
        });

    }

    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' style={{ color: '#2185d0' }} textAlign='center'>
                    <span>{t("login")}</span>
                </Header>
                <Form size='large' onSubmit={handleSubmit(actionButtonSubmit)}>
                    <Segment stacked>

                        {errorLogin && !errors.userPass && !errors.userName &&
                            <Grid.Row centered>
                                <b className="color-letter-error">{t("error-email-pass")}</b>
                            </Grid.Row>
                        }
                        {errors.userName &&
                            < Grid.Row>
                                <b className="color-letter-error">{t("error-email-login")}</b>
                            </Grid.Row>
                        }
                        <Form.Input fluid labelPosition='left' type='text' placeholder={t("email-address")}>
                            <Label basic><Icon disabled name='user' /></Label>
                            <input id="userName" name="userName" ref={register({ required: true })} />
                        </Form.Input>

                        {errors.userPass &&
                            <Grid.Row>
                                <b className="color-letter-error">{t("error-password-login")}</b>
                            </Grid.Row>
                        }
                        <Form.Input fluid labelPosition='left' type='password' placeholder={t("password")}>
                            <Label basic><Icon disabled name='lock' /></Label>
                            <input id="userPass" name="userPass" ref={register({ required: true })} />
                        </Form.Input>

                        <Button type="submit" style={{ backgroundColor: '#2185d0', color: 'white' }} fluid size='large'>
                            {t("login")}
                        </Button>
                    </Segment>
                </Form>
                <Message>
                    {t("return-home")}? <Link to={"/home"}>{t("click-here")}</Link>
                </Message>
            </Grid.Column>
        </Grid>
    );
}