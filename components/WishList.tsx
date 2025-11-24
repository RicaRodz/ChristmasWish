"use client";

import { useState } from "react";
import Microlink from '@microlink/react';
import AddWishForm from "./AddWishForm";
import EditWishForm from "./EditWishForm";
import { deleteWish } from "@/app/actions/wishes";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Plus, X, Edit2, Trash2, Loader2, ExternalLink, StickyNote } from "lucide-react";

type Wish = {
  id: string;
  name: string;
  link: string | null;
  notes: string | null;
  reserved_by: string | null;
  priority: number | null;
  created_at: string;
};

type WishListProps = {
  wishes: Wish[];
  userId: string;
};

const priorityConfig = {
  1: { label: "Low", color: "bg-slate-100 text-slate-600 hover:bg-slate-200" },
  2: { label: "Medium", color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
  3: { label: "High", color: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" },
  4: { label: "Very High", color: "bg-orange-50 text-orange-700 hover:bg-orange-100" },
  5: { label: "Must Have", color: "bg-red-50 text-red-700 hover:bg-red-100" },
};

export default function WishList({ wishes: initialWishes, userId }: WishListProps) {
  const [wishes, setWishes] = useState(initialWishes);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWish, setEditingWish] = useState<string | null>(null);
  const [deletingWish, setDeletingWish] = useState<string | null>(null);

  async function handleDelete(wishId: string) {
    if (!confirm("Are you sure you want to delete this wish?")) {
      return;
    }
    setDeletingWish(wishId);
    const result = await deleteWish(wishId);
    if (result.error) {
      alert(`Error: ${result.error}`);
    }
    setDeletingWish(null);
  }

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Gift className="w-6 h-6 text-red-600" />
            Your Wish List
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage the gifts you&apos;re hoping for.
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className={showAddForm ? "bg-gray-100 text-gray-900 hover:bg-gray-200" : "bg-red-600 hover:bg-red-700 text-white"}
          variant={showAddForm ? "secondary" : "default"}
        >
          {showAddForm ? (
            <>
              <X className="w-4 h-4 mr-2" /> Close
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" /> Add Wish
            </>
          )}
        </Button>
      </div>

      {/* FORM SECTION */}
      {showAddForm && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <AddWishForm 
            onCancel={() => setShowAddForm(false)}
            onSuccess={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* EMPTY STATE */}
      {wishes.length === 0 && !showAddForm ? (
         <div className="text-center py-16 bg-white rounded-xl border border-dashed">
           <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-red-300" />
           </div>
           <h3 className="text-lg font-semibold text-gray-900">No wishes yet</h3>
           <p className="text-gray-500 text-sm mt-1">Start adding items to share with your friends!</p>
         </div>
      ) : (
        /* GRID LAYOUT */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishes.map((wish) => (
            <div key={wish.id} className="h-full">
              {editingWish === wish.id ? (
                <EditWishForm
                  wish={wish}
                  onCancel={() => setEditingWish(null)}
                  onSuccess={() => setEditingWish(null)}
                />
              ) : (
                <Card className="h-full flex flex-col transition-all hover:shadow-md border-slate-200 group">
                  
                  {/* 1. HEADER: Title & Priority */}
                  <CardHeader className="pb-3 space-y-1">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-xl font-bold leading-tight text-gray-900 break-words">
                        {wish.name}
                      </CardTitle>
                      {wish.priority && (
                        <Badge 
                          variant="secondary"
                          className={`shrink-0 ${priorityConfig[wish.priority as keyof typeof priorityConfig].color}`}
                        >
                          {priorityConfig[wish.priority as keyof typeof priorityConfig].label}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  {/* 2. CONTENT: Notes & Link */}
                  <CardContent className="flex-1 space-y-4 pb-3">
                    {/* Notes Section */}
                    {wish.notes && (
                      <div className="text-sm text-gray-600 flex gap-2 items-start">
                        <StickyNote className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                        <span className="italic">{wish.notes}</span>
                      </div>
                    )}

                    {/* Link Section - Reduced Clutter */}
                    {wish.link && (
                      <div className="mt-4">
                        <Microlink 
                          url={wish.link} 
                          size="normal"
                          style={{ width: '100%', borderRadius: '0.5rem' }}
                        />
                      </div>
                    )}
                  </CardContent>

                  {/* 3. FOOTER: Actions (Clean separation) */}
                  <CardFooter className="pt-3 border-t bg-slate-50/50 flex justify-between items-center">
                     {wish.link ? (
                        <Button variant="link" size="sm" className="px-0 text-blue-600 h-auto" asChild>
                          <a href={wish.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1.5" />
                            Visit Link
                          </a>
                        </Button>
                     ) : (
                       <span /> /* Spacer */
                     )}

                     <div className="flex gap-1">
                        <Button
                          onClick={() => setEditingWish(wish.id)}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(wish.id)}
                          disabled={deletingWish === wish.id}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                        >
                          {deletingWish === wish.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                     </div>
                  </CardFooter>
                </Card>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}