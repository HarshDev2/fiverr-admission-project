import { redirect } from "@sveltejs/kit";

export async function load(){
    throw redirect(302, '/placement');
    console.log("redirected")
}