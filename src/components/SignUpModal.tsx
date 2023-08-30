import { z } from 'zod';
import { Field, Form, Formik } from 'formik';
import { useModalEscape } from '@/hooks/modal';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';

const SignupSchema = z.object({
	username: z.string().min(3).max(20),
	password: z.string().min(8).max(100),
});

type SignupType = z.infer<typeof SignupSchema>;

type SignupModalProps = {
	isOpen: boolean;
	setOpen: (open: boolean) => void;
};

export default function SignupModal({ isOpen, setOpen }: SignupModalProps) {
	const [submitted, setSubmitted] = useState(false);
	useModalEscape(() => setOpen(false));

	useEffect(() => {
		if (submitted) {
			setOpen(false);
		}
	}, [submitted]);

	return (
		<div
			onClick={(e) => {
				if (e.target === e.currentTarget) setOpen(false);
			}}
			className="absolute h-screen w-screen flex justify-center items-center bg-white/80"
		>
			<div className="w-[450px] pb-10 flex flex-col justify-center items-center">
				<div className="bg-slate-100 rounded-t-xl w-full flex justify-center py-2 font-semibold text-slate-500">
					Sign Up
				</div>
				<div className="w-full border border-slate-400/10 rounded-b-xl border-t-0 py-4 px-4 bg-slate-200/10 flex flex-col">
					<Formik
						initialValues={{ username: '', password: '' }}
						onSubmit={async (values: SignupType) => {
							const res = await fetch('/api/signup', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify(values),
							});

							if (!res.ok) {
								const data = await res.json();
								alert(data.error);
								return;
							}

							await signIn('credentials', {
								username: values.username,
								password: values.password,
							});

							return setSubmitted(true);
						}}
						validationSchema={toFormikValidationSchema(SignupSchema)}
					>
						{({ values, errors }) => (
							<Form className="flex flex-col gap-4">
								<div className="flex flex-col gap-1">
									<label className="text-slate-500/80 text-xs font-medium">
										Username
									</label>
									<Field
										name="username"
										placeholder="johnode"
										className="focus:outline-none rounded-sm bg-slate-100 text-black/50 py-2 px-3 text-xs placeholder-black/20"
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-slate-500/80 text-xs font-medium">
										Password
									</label>
									<Field
										name="password"
										placeholder="●●●●●●●●●●●●"
										type="password"
										className="focus:outline-none rounded-sm bg-slate-100 text-black/50 py-2 px-3 text-xs placeholder-black/20"
									/>
								</div>
								<div className="h-3 text-xs text-red-400">
									{[errors.password, errors.username].filter((x) => x).join(', ')}
								</div>
								<button
									className="bg-slate-600 mb-4 text-white text-sm font-semibold rounded-md py-2"
									type="submit"
								>
									Submit
								</button>
							</Form>
						)}
					</Formik>
				</div>
			</div>
		</div>
	);
}
