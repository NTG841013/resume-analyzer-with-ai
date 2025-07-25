import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import type { Feedback } from "~/types";

export const meta = () => ([
    { title: 'Vitrae| Review' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) {
            navigate(`/auth?next=/resume/${id}`);
        }
    }, [isLoading, auth.isAuthenticated, id, navigate]);

    useEffect(() => {
        const loadResume = async () => {
            try {
                setLoading(true);
                const resume = await kv.get(`resume:${id}`);
                if(!resume) {
                    navigate('/');
                    return;
                }

                const data = JSON.parse(resume);

                // Load PDF
                const resumeBlob = await fs.read(data.resumePath);
                if(resumeBlob) {
                    const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
                    setResumeUrl(URL.createObjectURL(pdfBlob));
                }

                // Load image
                const imageBlob = await fs.read(data.imagePath);
                if(imageBlob) {
                    setImageUrl(URL.createObjectURL(imageBlob));
                }

                setFeedback(data.feedback || null);
            } catch (error) {
                console.error('Error loading resume:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        }

        loadResume();

        return () => {
            // Clean up blob URLs
            if (resumeUrl) URL.revokeObjectURL(resumeUrl);
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        };
    }, [id, fs, kv, navigate]);

    if (loading) {
        return (
            <main className="bg-[url('/images/bg.svg')] bg-cover min-h-screen flex items-center justify-center">
                <img 
                    src="/images/resume-scan-2.gif" 
                    alt="Loading resume" 
                    className="w-64" 
                />
            </main>
        );
    }

    return (
        <main className="bg-[url('/images/bg.svg')] bg-cover min-h-screen">
            <nav className="resume-nav flex justify-between items-center">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="Back" className="w-2.5 h-2.5 invert" />
                    <span className="text-white text-sm font-semibold">Back to Homepage</span>
                </Link>
                <button 
                    onClick={async () => {
                        await auth.signOut();
                        navigate('/auth');
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                    Log Out
                </button>
            </nav>
            
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left side - Resume */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        {resumeUrl ? (
                            <div className="aspect-[1/1.4] w-full relative">
                                <embed 
                                    src={resumeUrl} 
                                    type="application/pdf" 
                                    className="absolute inset-0 w-full h-full"
                                />
                            </div>
                        ) : (
                            <div className="aspect-[1/1.4] w-full flex items-center justify-center bg-gray-100 rounded-lg">
                                <p className="text-gray-500">Resume not available</p>
                            </div>
                        )}
                    </div>

                    {/* Right side - Review */}
                    <div className="space-y-6">
                        {feedback ? (
                            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                                <Summary feedback={feedback} />
                                <ATS score={feedback.ATS?.score || 0} suggestions={feedback.ATS?.tips || []} />
                                <Details feedback={feedback} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                <img 
                                    src="/images/resume-scan-2.gif" 
                                    alt="Analyzing resume" 
                                    className="w-full max-w-md" 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Resume;