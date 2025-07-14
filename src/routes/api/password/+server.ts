import { json } from '@sveltejs/kit';
import 'dotenv/config';

export async function GET({ url, request }: { url: URL; request: Request }) {
	const password = url.searchParams.get('password') || '';

	console.log(request.headers);

	const storedPass = process.env.ADMIN_PASS;
	if (!storedPass) {
		return json({ error: 'No password set' }, { status: 500 });
	} else if (storedPass !== password) {
		return json({ error: 'Wrong password' }, { status: 403 });
	}

	return json({ password }, { status: 200 });
}
