import { useState, useEffect, useCallback } from 'react';
import { Activity } from 'lucide-react';
import Header from './components/Header';
import UploadScreen from './components/UploadScreen';
import ProcessingScreen from './components/ProcessingScreen';
import ReviewScreen from './components/ReviewScreen';
import EventLogPanel from './components/EventLogPanel';
import { photoService, eventService } from './services/api';
import type { Photo, Event } from './types';

const App = () => {
  const [activeScreen, setActiveScreen] = useState('upload');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isEventPanelOpen, setIsEventPanelOpen] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // Fetch photos with better error handling
  const fetchPhotos = useCallback(async () => {
    try {
      console.log('📥 Fetching photos...');
      const data = await photoService.getAll();
      setPhotos(data.photos);
      setLastFetchTime(Date.now());
      console.log('✅ Photos fetched:', data.photos.length, 'photos');
      
      // Log processing status
      const processing = data.photos.filter(p => p.status === 'processing' || p.status === 'pending');
      if (processing.length > 0) {
        console.log('⏳ Active photos:', processing.map(p => ({ 
          id: p.id.slice(0, 8), 
          name: p.originalName, 
          status: p.status 
        })));
      }
    } catch (error) {
      console.error('❌ Error fetching photos:', error);
    }
  }, []);

  // Fetch events with better error handling
  const fetchEvents = useCallback(async () => {
    try {
      const data = await eventService.getAll();
      setEvents(data.events);
    } catch (error) {
      console.error('❌ Error fetching events:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    console.log('🚀 App initialized');
    fetchPhotos();
    fetchEvents();
  }, [fetchPhotos, fetchEvents]);

  // Track viewport to adapt layout
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = () => setIsDesktop(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Auto-open event panel on desktop
  useEffect(() => {
    setIsEventPanelOpen(isDesktop);
  }, [isDesktop]);

  // IMPROVED: Aggressive polling for active photos
  useEffect(() => {
    const hasActivePhotos = photos.some(
      photo => photo.status === 'pending' || photo.status === 'processing'
    );

    if (!hasActivePhotos) {
      console.log('✓ No active photos, polling stopped');
      return;
    }

    console.log('🔄 Polling enabled - active photos detected');

    // Poll every 1 second when photos are processing
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchTime;
      
      console.log(`⏱️  Polling (${timeSinceLastFetch}ms since last fetch)...`);
      fetchPhotos();
      fetchEvents();
    }, 1000); // Poll every 1 second instead of 2

    return () => {
      console.log('🛑 Polling stopped');
      clearInterval(interval);
    };
  }, [photos, fetchPhotos, fetchEvents, lastFetchTime]);

  // Handle file upload
  const handleUpload = async (files: File[]) => {
    setLoading(true);
    try {
      console.log('📤 Uploading', files.length, 'files...');
      await photoService.upload(files);
      
      // Wait a moment then fetch
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchPhotos();
      await fetchEvents();
      
      console.log('✅ Upload complete, switching to processing screen');
      setActiveScreen('processing');
    } catch (error) {
      console.error('❌ Upload error:', error);
      alert('Failed to upload photos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle photo deletion
  const handleDelete = async (photoId: string) => {
    try {
      console.log('🗑️  Deleting photo:', photoId);
      await photoService.delete(photoId);
      await fetchPhotos();
      await fetchEvents();
      console.log('✅ Photo deleted');
    } catch (error) {
      console.error('❌ Delete error:', error);
      alert('Failed to delete photo. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex flex-col h-screen">
        <Header activeScreen={activeScreen} setActiveScreen={setActiveScreen} />

        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {activeScreen === 'upload' && (
              <UploadScreen onUpload={handleUpload} loading={loading} />
            )}
            {activeScreen === 'processing' && (
              <ProcessingScreen photos={photos} onDelete={handleDelete} />
            )}
            {activeScreen === 'review' && (
              <ReviewScreen photos={photos} onDelete={handleDelete} />
            )}
          </main>

          {/* Mobile activity toggle */}
          {!isDesktop && (
            <button
              type="button"
              onClick={() => setIsEventPanelOpen(prev => !prev)}
              className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all lg:hidden"
            >
              <Activity className="h-4 w-4" />
              {isEventPanelOpen ? 'Hide Activity' : 'Show Activity'}
            </button>
          )}

          {/* Overlay for drawer */}
          <div
            className={`fixed inset-0 z-20 bg-slate-900/50 transition-opacity duration-300 lg:hidden ${
              isEventPanelOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            onClick={() => !isDesktop && setIsEventPanelOpen(false)}
          />

          <aside
            className={`fixed bottom-0 left-0 right-0 z-30 transform transition-transform duration-300 lg:static lg:w-80 lg:translate-y-0 ${
              isEventPanelOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'
            }`}
            aria-hidden={!isDesktop && !isEventPanelOpen}
          >
            <EventLogPanel
              events={events}
              variant={isDesktop ? 'sidebar' : 'drawer'}
              onClose={!isDesktop ? () => setIsEventPanelOpen(false) : undefined}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default App;