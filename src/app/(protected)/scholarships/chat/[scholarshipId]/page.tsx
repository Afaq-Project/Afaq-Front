// import { notFound } from "next/navigation";
// import ChatBubble from "@/feature/decoments/component/chat/ChatBubble";
// import EligibilityNoticeCard from "@/feature/decoments/component/chat/EligibilityNotice";
// import { scholarshipChats } from "@/feature/decoments/component/chat/chat.data";

// export default async function ScholarshipChatPage({
//     params,
// }: {
//     params: Promise<{ scholarshipId: string }>;
// }) {
//     const { scholarshipId } = await params;
//     const chat = scholarshipChats.find((c) => c.id === scholarshipId);

//     if (!chat) {
//         notFound();
//     }

//     return (
//         <div className="min-h-screen bg-[#FAF8F3]">
//             <main className="mx-auto max-w-2xl px-6 py-8">
//                 {/* Header */}
//                 <div className="mb-1">
//                     <h1 className="text-lg font-semibold text-stone-900">
//                         Chatting about: {chat.scholarshipName}
//                     </h1>
//                     <p className="text-xs text-stone-400 mt-1">
//                         ⓘ All guidance does not guarantee application outcomes
//                     </p>
//                 </div>

//                 <div className="mt-6 flex flex-col gap-4">
//                     {chat.messages.map((message) => (
//                         <ChatBubble key={message.id} message={message} />
//                     ))}

//                     {chat.eligibilityNotice && (
//                         <EligibilityNoticeCard notice={chat.eligibilityNotice} />
//                     )}
//                 </div>
//             </main>
//         </div>
//     );
// }
import { ExternalLink, Send } from "lucide-react";

export default async function ScholarshipChatPage({
    params,
}: {
    params: Promise<{ scholarshipId: string }>;
}) {
    const { scholarshipId } = await params;

    return (
        <div className="min-h-screen bg-[#FAF8F3] p-6 flex flex-col justify-between">
            <main className="mx-auto max-w-4xl w-full bg-white rounded-xl border border-stone-200 p-6 shadow-sm flex-1 flex flex-col justify-between">
                {/* Header & Warning Banner */}
                <div>
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                        <h1 className="text-lg font-bold text-stone-800">
                            Chatting about: Global Merit Scholarship
                        </h1>
                    </div>

                    <div className="bg-[#F5EFE6] border border-[#E6DCCE] rounded-md px-3 py-2 text-xs text-[#8A6D3B] mb-6">
                        ⚠️ AI guidance does not guarantee application outcomes
                    </div>

                    {/* Messages Container */}
                    <div className="space-y-4">
                        {/* AI Message 1 */}
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 text-xs font-bold">
                                🤖
                            </div>
                            <div className="bg-stone-100 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-stone-800 max-w-lg">
                                Hello! I&apos;m here to help you with your application for the Global Merit Scholarship. What would you like to know?
                            </div>
                        </div>

                        {/* User Message 1 */}
                        <div className="flex items-start gap-3 justify-end">
                            <div className="bg-[#1C3D27] text-white rounded-2xl rounded-tr-none px-4 py-3 text-sm max-w-lg">
                                Can you check if my current GPA meets the requirements?
                            </div>
                            <div className="w-8 h-8 rounded-full bg-stone-300 flex items-center justify-center text-stone-700 text-xs font-bold">
                                👤
                            </div>
                        </div>

                        {}
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 text-xs font-bold">
                                🤖
                            </div>
                            <div className="bg-stone-100 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-stone-800 max-w-lg">
                                The standard requirement for this scholarship is a minimum GPA of 3.5 on a 4.0 scale.
                            </div>
                        </div>

                        {/* User Message 2 */}
                        <div className="flex items-start gap-3 justify-end">
                            <div className="bg-[#1C3D27] text-white rounded-2xl rounded-tr-none px-4 py-3 text-sm max-w-lg">
                                I have a 3.4 but I&apos;m president of the debate club. Does that count for anything?
                            </div>
                            <div className="w-8 h-8 rounded-full bg-stone-300 flex items-center justify-center text-stone-700 text-xs font-bold">
                                👤
                            </div>
                        </div>

                        {/* Eligibility Warning Box */}
                        <div className="ml-11 max-w-lg bg-[#FAF8F3] border border-stone-300 rounded-lg p-4 text-xs text-stone-700 space-y-2">
                            <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                                <span>⚠️</span> Eligibility Verification Limited
                            </div>
                            <p>
                                I cannot definitively verify if extracurricular activities can waive the hard GPA requirement. This type of exception is handled on a case-by-case basis by the admissions committee.
                            </p>
                            <a
                                href="#"
                                className="inline-flex items-center gap-1 bg-stone-200 hover:bg-stone-300 text-stone-800 px-2.5 py-1.5 rounded text-xs transition-colors font-medium"
                            >
                                Visit official website <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer / Input Box */}
                <div className="mt-8 pt-4 border-t border-stone-100">
                    <div className="text-right text-[11px] text-stone-400 mb-1">
                        14 of 20 free messages used this month
                    </div>
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Message Levora AI..."
                            className="w-full bg-stone-100 rounded-xl px-4 py-3 text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
                        />
                        <button className="absolute right-3 text-stone-500 hover:text-stone-800">
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-stone-400 mt-2">
                        AI can make mistakes. Verify important information.
                    </p>
                </div>
            </main>
        </div>
    );
}