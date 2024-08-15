import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitPost } from "./actions";
import { PostsPage } from "@/lib/types";
import { validateRequest } from "@/auth";
import { useSession } from "@/app/(main)/SessionProvider";

export function useSubmitPostMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { user} = useSession();

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      const queryFilter = { queryKey: ["post-feed"], predicate(query){
        return query.queryKey.includes("for-you") || (query.queryKey.includes("user-posts") && query.queryKey.includes(user.id))
      } } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilter);

      // here we can still use the code below, but it is slow
      // queryClient.invalidateQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,

              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });

      toast({
        description: "Post created!",
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit post. Please try again later.",
      });
    },
  });

  return mutation;
}
