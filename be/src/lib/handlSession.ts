import { Session } from "../db/models/session.model";

async function handleSession({ sessionId }: { sessionId: string }) {
    const verifySessionId = await Session.findById(sessionId)
    if (!verifySessionId) return false;
    if (verifySessionId.state === "inactive") return false;
}


export { handleSession }