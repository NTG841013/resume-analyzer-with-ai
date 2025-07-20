import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Navbar from '~/components/Navbar';
import { usePuterStore } from '~/lib/puter';
import ResumeCard from '~/components/ResumeCard';

const Resume = () => {
    const { id } = useParams();
    const { kv } = usePuterStore();
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await kv.get(`resume:${id}`);
                if (!result) {
                    setError('Resume not found');
                    return;
                }
                setData(JSON.parse(result));
            } catch (err) {
                setError('Failed to load resume data');
                console.error(err);
            }
        };

        fetchData();
    }, [id, kv]);

    if (error) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover">
                <Navbar />
                <section className="main-section">
                    <div className="page-heading py-16">
                        <h1>Error</h1>
                        <h2>{error}</h2>
                    </div>
                </section>
            </main>
        );
    }

    if (!data) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover">
                <Navbar />
                <section className="main-section">
                    <div className="page-heading py-16">
                        <h1>Loading...</h1>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Resume Analysis</h1>
                    <ResumeCard resume={data} />
                </div>
            </section>
        </main>
    );
};

export default Resume;
