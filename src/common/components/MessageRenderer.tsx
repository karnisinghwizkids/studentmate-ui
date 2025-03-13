import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ExternalLink } from 'lucide-react';

interface MessageRendererProps {
  content: string;
}

const MessageRenderer: React.FC<MessageRendererProps> = ({ content }) => {
  const processYouTubeLinks = (text: string) => {
    // Split content into blocks
    const blocks = text.split('\n\n');
    const parts: JSX.Element[] = [];

    blocks.forEach((block, index) => {
      // Check if this block contains a YouTube video with improved regex
      const videoMatch = block.match(/Title: (.*?)\nDescription: (.*?)\nhttps?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/s);

      if (videoMatch) {
        const [_, title, description, videoId] = videoMatch;
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        
        parts.push(
          <div key={`youtube-${index}`} className="my-4 bg-white/10 rounded-lg overflow-hidden">
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                title={title || "YouTube video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="p-4">
              {title && <h3 className="font-semibold text-lg mb-1 text-white">{title}</h3>}
              {description && <p className="text-sm text-white/70 mb-2">{description}</p>}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300"
              >
                Watch on YouTube <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        );
      } else {
        // Process non-video blocks with ReactMarkdown
        parts.push(
          <ReactMarkdown
            key={`text-${index}`}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              img({ src, alt, ...props }) {
                if (!src) return null;
                
                if (src.includes('images.nasa.gov/details/')) {
                  const imageId = src.split('/').pop();
                  src = `https://images-assets.nasa.gov/image/${imageId}/${imageId}~medium.jpg`;
                }
                
                return (
                  <div className="my-4">
                    <img
                      src={src}
                      alt={alt || 'Image'}
                      className="rounded-lg max-w-full h-auto mx-auto"
                      loading="lazy"
                      {...props}
                    />
                    {alt && <p className="text-sm text-white/70 mt-2 text-center">{alt}</p>}
                  </div>
                );
              },
              a({ href, children, ...props }) {
                if (href?.match(/youtube\.com|youtu\.be/)) {
                  return <span>{children}</span>;
                }
                return (
                  <a
                    href={href}
                    className="text-blue-400 hover:text-blue-300 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                );
              },
              p({ children }) {
                return <p className="mb-4 last:mb-0">{children}</p>;
              }
            }}
          >
            {block}
          </ReactMarkdown>
        );
      }
    });

    return parts;
  };

  return (
    <div className="prose prose-invert max-w-none text-white">
      {processYouTubeLinks(content)}
    </div>
  );
};

export default MessageRenderer;