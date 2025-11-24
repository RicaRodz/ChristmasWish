"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Microlink from '@microlink/react';
import { reserveWish, unreserveWish } from "@/app/actions/reserve";
import { ExternalLink, CheckCircle, Lock, Loader2, StickyNote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Wish = {
  id: string;
  name: string;
  link: string | null;
  notes: string | null;
  reserved_by: string | null;     
  reserved_by_id: string | null;
  priority: number | null;
  created_at: string;
};

type PublicWishListProps = {
  wishes: Wish[];
  isOwnList: boolean;
  listOwnerId: string;
  currentUserId: string;
  currentUserName: string;
};

const priorityConfig = {
  1: { label: "Nice to have", color: "bg-slate-100 text-slate-600" },
  2: { label: "Like to have", color: "bg-blue-50 text-blue-600" },
  3: { label: "Want", color: "bg-yellow-50 text-yellow-700" },
  4: { label: "Really want", color: "bg-orange-50 text-orange-700" },
  5: { label: "Must have!", color: "bg-red-50 text-red-700 border-red-100" },
};

export default function PublicWishList({ 
  wishes, 
  isOwnList, 
  listOwnerId,
  currentUserId
}: PublicWishListProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // --- ACTIONS ---
  async function handleReserve(wishId: string) {
    setLoadingId(wishId);
    
    // Server action to reserve
    const result = await reserveWish(wishId, listOwnerId);

    if (result.error) {
      alert(result.error);
    } else {
      router.refresh(); 
    }
    setLoadingId(null);
  }

  async function handleUnreserve(wishId: string) {
    if (!confirm("Are you sure you want to release this gift?")) return;
    setLoadingId(wishId);

    const result = await unreserveWish(wishId, listOwnerId);

    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setLoadingId(null);
  }

  // --- FILTERING ---
  const availableWishes = wishes.filter(w => !w.reserved_by);
  const reservedWishes = isOwnList 
    ? [] // Owner sees nothing here
    : wishes.filter(w => w.reserved_by);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 🟢 SECTION: AVAILABLE WISHES */}
      {availableWishes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableWishes.map((wish) => (
            <Card key={wish.id} className="overflow-hidden border-0 shadow-lg flex flex-col h-full hover:shadow-xl transition-shadow">
              
              {/* Image / Link Area */}
              {wish.link ? (
                <div className="bg-slate-50 border-b relative h-48 w-full">
                   <Microlink 
                      url={wish.link} 
                      size="large" 
                      media="image" 
                      style={{ width: '100%', height: '100%', border: 'none' }} 
                   />
                   <a 
                      href={wish.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 p-2 bg-white/90 rounded-full text-blue-600 shadow hover:bg-white transition-colors"
                   >
                      <ExternalLink className="w-4 h-4" />
                   </a>
                </div>
              ) : (
                <div className="h-2 bg-gradient-to-r from-red-500 to-green-500" />
              )}

              <CardContent className="p-5 flex flex-col flex-1">
                {/* Priority Badge */}
                {wish.priority && (
                   <Badge variant="secondary" className={`mb-3 w-fit ${priorityConfig[wish.priority as keyof typeof priorityConfig].color}`}>
                      {priorityConfig[wish.priority as keyof typeof priorityConfig].label}
                   </Badge>
                )}

                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                  {wish.name}
                </h3>
                
                {wish.notes && (
                  <div className="bg-slate-50 p-3 rounded-md text-sm text-slate-600 mb-4 flex items-start gap-2 border border-slate-100">
                    <StickyNote className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
                    <span>{wish.notes}</span>
                  </div>
                )}

                <div className="flex-1" />

                <div className="mt-4 pt-4 border-t border-slate-100">
                   {!isOwnList ? (
                     <Button 
                       onClick={() => handleReserve(wish.id)}
                       disabled={loadingId === wish.id}
                       className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                     >
                       {loadingId === wish.id ? (
                         <Loader2 className="w-4 h-4 animate-spin mr-2" />
                       ) : (
                         <CheckCircle className="w-4 h-4 mr-2" />
                       )}
                       I&apos;ll get this!
                     </Button>
                   ) : (
                     <p className="text-center text-sm text-slate-400 italic">
                        Available for friends to reserve
                     </p>
                   )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 🔒 SECTION: RESERVED WISHES */}
      {reservedWishes.length > 0 && (
        <div className="relative pt-8">
           <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-white/20 flex-1" />
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-white/80" />
              Already Reserved
            </h3>
            <div className="h-px bg-white/20 flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reservedWishes.map((wish) => {
              const isMyReservation = wish.reserved_by_id === currentUserId;

              return (
                <div key={wish.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-50">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  
                  <h4 className="text-lg font-bold text-white/70 line-through decoration-white/50">
                    {wish.name}
                  </h4>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Reserved By</span>
                      <span className="text-white font-medium">
                        {isMyReservation ? "You" : wish.reserved_by}
                      </span>
                    </div>

                    {isMyReservation && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleUnreserve(wish.id)}
                        disabled={loadingId === wish.id}
                        className="h-8 bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/50"
                      >
                         {loadingId === wish.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                         ) : "Undo"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {wishes.length === 0 && (
         <div className="text-center py-20 bg-white/90 backdrop-blur rounded-2xl shadow-xl">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-2xl font-bold text-gray-900">This list is empty!</h3>
            <p className="text-gray-500 mt-2">Check back later to see what they add.</p>
         </div>
      )}
    </div>
  );
}