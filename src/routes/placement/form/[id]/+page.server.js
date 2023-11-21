import { redirect } from '@sveltejs/kit';

export async function load({ params }){
    let id = params.id;

    if(id != "99") throw redirect(302, '/placement');
}