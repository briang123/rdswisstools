'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function AIChatSheet() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: 'ai', text: 'Hi! How can I help you today?' }]);
  const [input, setInput] = useState('');
  const [width, setWidth] = useState(400);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(400);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, messages]);

  function handleSend() {
    if (!input.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      { from: 'user', text: input },
      { from: 'ai', text: '(AI response placeholder)' },
    ]);
    setInput('');
  }

  // When open, add a class to body to add right margin
  useEffect(() => {
    if (open) {
      document.body.style.marginRight = `${width}px`;
    } else {
      document.body.style.marginRight = '';
    }
    return () => {
      document.body.style.marginRight = '';
    };
  }, [open, width]);

  // Drag handlers
  function handleDragMouseDown(e: React.MouseEvent) {
    dragging.current = true;
    startX.current = e.clientX;
    startWidth.current = width;

    function onMouseMove(ev: MouseEvent) {
      if (!dragging.current) return;
      const dx = startX.current - ev.clientX;
      const newWidth = Math.min(800, Math.max(400, startWidth.current + dx));
      setWidth(newWidth);
    }
    function onMouseUp() {
      dragging.current = false;
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'ew-resize';
  }

  return (
    <>
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 50,
            borderRadius: '50%',
            width: 56,
            height: 56,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            padding: 0,
          }}
          aria-label="Open AI Chat"
          data-testid="chat-open-button"
        >
          <span style={{ fontSize: 28 }}>💬</span>
        </Button>
      )}
      {open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: width,
            minWidth: 400,
            maxWidth: 800,
            height: '100vh',
            background: 'var(--background)',
            color: 'var(--foreground)',
            boxShadow: '-2px 0 8px rgba(0,0,0,0.08)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid var(--border)',
            transition: 'width 0.1s',
          }}
          data-testid="chat-window"
        >
          {/* Drag handle */}
          <div
            onMouseDown={handleDragMouseDown}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 16,
              height: '100%',
              cursor: 'ew-resize',
              zIndex: 101,
              background: 'transparent',
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Resize chat sidebar"
            tabIndex={0}
            role="separator"
            data-testid="chat-drag-handle"
          >
            <div
              style={{
                width: 4,
                height: 40,
                borderRadius: 2,
                background: 'var(--border)',
                opacity: 0.7,
              }}
            />
          </div>
          <div
            style={{
              padding: 20,
              borderBottom: '1px solid var(--border)',
              fontWeight: 600,
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            AI Chat
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              data-testid="chat-close-button"
            >
              <span style={{ fontSize: 22 }}>&times;</span>
            </Button>
          </div>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 20,
              background: 'var(--popover)',
              color: 'var(--popover-foreground)',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 12,
                  textAlign: msg.from === 'user' ? 'right' : 'left',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    background: msg.from === 'user' ? 'var(--secondary)' : 'var(--muted)',
                    color: 'var(--foreground)',
                    borderRadius: 16,
                    padding: '8px 14px',
                    maxWidth: '80%',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              display: 'flex',
              gap: 8,
              padding: 16,
              borderTop: '1px solid var(--border)',
              background: 'var(--background)',
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              rows={3}
              style={{
                flex: 1,
                resize: 'none',
                borderRadius: 6,
                border: '1px solid var(--input)',
                padding: '8px 12px',
                fontSize: 16,
                fontFamily: 'inherit',
                background: 'var(--input)',
                color: 'var(--foreground)',
              }}
              autoFocus={open}
              data-testid="chat-input"
            />
            <Button
              type="submit"
              disabled={!input.trim()}
              style={{ alignSelf: 'flex-end', height: 40 }}
              data-testid="chat-send-button"
            >
              Send
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
