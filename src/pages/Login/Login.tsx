import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pages } from "../../@types";
import { Brands, Button, Input } from "../../components";
import "./styles.scss";
import { AUTH_TOKEN_KEY, AuthService } from "../../api";
import { useDispatch } from "react-redux";
import { AppDispatch, UserActions } from "../../store";

interface LoginPageProps {}

const LoginPage: React.FC<LoginPageProps> = () => {
	const [loginData, setLoginData] = useState({
		email: "",
		password: "",
	});

	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	const canLogin = useMemo(
		() => loginData && loginData.email && loginData.password,
		[loginData]
	);

	const onLogin = async () => {
		try {
			setLoading(true);

			const { data } = await AuthService.login(
				loginData.email,
				loginData.password
			);

			if (data.access_token) {
				localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);

				const user = await AuthService.getCurrentUser();

				dispatch(UserActions.setUser(user.data));

				if (user.data.is_admin) {
					navigate(Pages.Orders);
				}

				if (!user.data.is_admin) {
					navigate(Pages.WaiterHome);
				}
			}

			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
	};

	return (
		<div className="login">
			<div className="login-brands">
				<Brands.JobucBrand size={100} />
				<Brands.SocialSipsBrand size={145} />
			</div>
			<div className="login-content">
				<h2 className="page-title">Fazer Login</h2>
				<form className="login-form">
					<Input
						onChangeValue={(value) =>
							setLoginData((curr) => ({ ...curr, email: value }))
						}
						value={loginData.email}
						fieldKey="email"
						placeholder="E-mail"
					/>
					<Input
						fieldKey="password"
						placeholder="Senha"
						onChangeValue={(value) =>
							setLoginData((curr) => ({ ...curr, password: value }))
						}
						value={loginData.password}
						type="password"
					/>
				</form>
				<Button disabled={!canLogin} loading={loading} onClick={onLogin}>
					CONTINUAR
				</Button>
			</div>
		</div>
	);
};

export default LoginPage;
