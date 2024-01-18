import React from 'react';
import { createRoot } from 'react-dom/client';
import '../assets/tailwind.css';

const HelpPage = () => {
    return (
        <div className="flex">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-gray-200 h-screen overflow-y-auto">
                <div className="p-4 sticky top-0">
                    <h2 className="text-xl font-semibold mb-4">Documentation</h2>
                    <nav>
                        <ul>
                            <li className="mb-2"><a href="#overview" className="text-blue-500 hover:underline">Overview</a></li>
                            <li className="mb-2"><a href="#getting-started" className="text-blue-500 hover:underline">Get Started</a></li>
                            <li className="mb-2"><a href="#migration-steps" className="text-blue-500 hover:underline">Migration Steps</a></li>
                            <li className="mb-2"><a href="#examples" className="text-blue-500 hover:underline">Examples</a></li>
                            <li className="mb-2"><a href="#faq" className="text-blue-500 hover:underline">FAQ</a></li>
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-4">
                <h1 className="text-5xl text-green-500 mb-4">Migrate to Manifest V3</h1>
                <section id="overview">
                    <h2 className="text-3xl font-bold mb-2">Overview</h2>
                    <p className="mt-1 mb-4">Learn about the benefits of migrating to Manifest V3 and the key differences from Manifest V2.</p>
                </section>
                <section id="getting-started">
                    <h2 className="text-3xl font-bold mb-2">Get Started</h2>
                    <p className="mt-1 mb-4">Steps to set up your development environment for Manifest V3.</p>
                </section>
                <section id="migration-steps">
                    <h2 className="text-3xl font-bold mb-2">Migration Steps</h2>
                    <p className="mt-1 mb-4">Follow these steps to transition your extension from Manifest V2 to V3.</p>
                </section>
                <section id="examples">
                    <h2 className="text-3xl font-bold mb-2">Examples</h2>
                    <p className="mt-1 mb-4">Explore code examples and best practices for a smooth migration.</p>
                </section>
                <section id="faq">
                    <h2 className="text-3xl font-bold mb-2">FAQ</h2>
                    <p className="mt-1">Frequently asked questions about Manifest V3.</p>
                </section>
                {/* ... additional sections as needed ... */}
            </main>
        </div>
    );
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<HelpPage />);

export default HelpPage;
