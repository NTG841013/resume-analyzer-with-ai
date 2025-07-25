import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import type { Feedback } from "~/types";

interface ResumeCardProps {
  resume: {
    id: string;
    companyName: string;
    jobTitle: string;
    feedback: Feedback | null | string; // Update the type to include null and string
    imagePath: string;
  };
}

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: ResumeCardProps) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadResume = async () => {
            try {
                setIsLoading(true);
                const blob = await fs.read(imagePath);
                if(!blob) return;
                
                let url = URL.createObjectURL(blob);
                setResumeUrl(url);
            } catch (error) {
                console.error('Error loading resume image:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadResume();
    }, [imagePath]);

    // Parse feedback if it's a string
    const parsedFeedback = typeof feedback === 'string' ? null : feedback;

    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
                    {jobTitle && <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
                </div>
                <div className="flex-shrink-0">
                   {isLoading ? (
                       <div className="w-[100px] h-[100px] flex items-center justify-center">
                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                       </div>
                   ) : parsedFeedback ? (
                      <ScoreCircle score={parsedFeedback.overallScore} />
                   ) : (
                      <div className="w-[100px] h-[100px] flex items-center justify-center text-gray-500">
                          No score
                      </div>
                   )}
                </div>
            </div>
            {resumeUrl && (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-full">
                        <img
                            src={resumeUrl}
                            alt="resume"
                            className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                        />
                    </div>
                </div>
            )}
        </Link>
    )
}

export default ResumeCard

