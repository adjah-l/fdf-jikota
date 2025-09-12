import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MapPin, X } from "lucide-react";
import { useNeighborhoods } from "@/hooks/useNeighborhoods";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import NeighborhoodCard from "./NeighborhoodCard";

interface NeighborhoodSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NeighborhoodSelector = ({ open, onOpenChange }: NeighborhoodSelectorProps) => {
  const { user } = useAuth();
  const { neighborhoods, userNeighborhoods, loading, joinNeighborhood } = useNeighborhoods();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string | null>(null);

  const filteredNeighborhoods = neighborhoods.filter(neighborhood => 
    neighborhood.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    neighborhood.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    neighborhood.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    neighborhood.zip_codes.some(zip => zip.includes(searchTerm))
  );

  const userNeighborhoodIds = userNeighborhoods.map(un => un.neighborhood_id);

  const handleJoinNeighborhood = async (neighborhoodId: string) => {
    if (!user) {
      setSelectedNeighborhoodId(neighborhoodId);
      setShowAuthModal(true);
      return;
    }

    const success = await joinNeighborhood(neighborhoodId);
    if (success) {
      onOpenChange(false);
    }
  };

  const handleAuthSuccess = async () => {
    setShowAuthModal(false);
    if (selectedNeighborhoodId && user) {
      const success = await joinNeighborhood(selectedNeighborhoodId);
      if (success) {
        onOpenChange(false);
      }
    }
    setSelectedNeighborhoodId(null);
  };

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setSelectedNeighborhoodId(null);
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Choose Your Neighborhood
            </DialogTitle>
            <DialogDescription>
              Join a neighborhood to connect with neighbors and discover local group opportunities that practice the 5C framework.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by neighborhood name, city, or zip code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <ScrollArea className="h-[500px]">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-muted-foreground">Loading neighborhoods...</div>
                </div>
              ) : filteredNeighborhoods.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mb-2" />
                  <div className="text-muted-foreground">
                    {searchTerm ? "No neighborhoods found matching your search." : "No neighborhoods available."}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                  {filteredNeighborhoods.map((neighborhood) => (
                    <NeighborhoodCard
                      key={neighborhood.id}
                      neighborhood={neighborhood}
                      isJoined={userNeighborhoodIds.includes(neighborhood.id)}
                      onJoin={handleJoinNeighborhood}
                      loading={loading}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      <AuthModal
        open={showAuthModal}
        onOpenChange={(open) => {
          setShowAuthModal(open);
          if (!open) {
            handleAuthSuccess();
          }
        }}
        defaultMode="signup"
      />
    </>
  );
};

export default NeighborhoodSelector;