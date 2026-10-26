import { createHttpClient, serviceUrls } from '../../../shared/http';
import type { Assignment, AssignmentCriterion, Delivery, LearningExecution, LearningGroup, Workspace } from '../domain/progress';

const learning = createHttpClient(serviceUrls.learning);
const community = createHttpClient(serviceUrls.community);
type List<T> = { items: T[]; total?: number; limit?: number; offset?: number };

export const progressClient = {
  createDelivery(executionId: string, comment: string, idempotencyKey: string) {
    return learning.request<{ item: Delivery }>('/v1/executions/' + encodeURIComponent(executionId) + '/deliveries', {
      method: 'POST', body: { comment }, idempotencyKey,
    });
  },
  reviewDelivery(deliveryId: string, expectedState: string, state: 'changes_requested' | 'accepted', message: string) {
    return learning.request<{ item: Delivery }>('/v1/deliveries/' + encodeURIComponent(deliveryId) + '/reviews', {
      method: 'POST', body: { expectedState, state, message },
    });
  },
  createAssignment(groupId: string, input: { activityVersionId: string; title: string; instructions: string; dueAt?: string; criteria: AssignmentCriterion[] }) {
    return learning.request<{ item: Assignment }>('/v1/groups/' + encodeURIComponent(groupId) + '/assignments', {
      method: 'POST', body: input,
    });
  },
  async load(language = 'es-CO') {
    const locale = encodeURIComponent(language);
    const [workspaces, executions, groups, activities] = await Promise.all([
      learning.request<List<Workspace>>('/v1/workspaces?limit=100&offset=0'),
      learning.request<List<LearningExecution>>('/v1/executions?limit=100&offset=0'),
      community.request<List<LearningGroup>>('/v1/groups?limit=100&offset=0'),
      learning.request<List<{activity_version_id:string;title:string;version:number}>>(`/v1/activities?locale=${locale}&limit=100&offset=0`),
    ]);
    const assignments = await Promise.all((groups.items ?? []).map(async group => ({
      group,
      items: (await learning.request<List<Assignment>>('/v1/groups/' + encodeURIComponent(group.id) + '/assignments')).items ?? [],
    })));
    const ownDeliveries = await Promise.all((executions.items ?? []).map(async execution => ({
      execution,
      items: (await learning.request<List<Delivery>>('/v1/executions/' + encodeURIComponent(execution.id) + '/deliveries?limit=5&offset=0')).items ?? [],
    })));
    const leaderDeliveries = await Promise.all((groups.items ?? []).filter(group => group.role === 'leader').map(async group => ({
      group,
      items: (await learning.request<List<Delivery>>('/v1/groups/' + encodeURIComponent(group.id) + '/deliveries?limit=100&offset=0')).items ?? [],
    })));
    return {
      workspaces: workspaces.items ?? [],
      executions: executions.items ?? [],
      groups: groups.items ?? [],
      activities: activities.items ?? [],
      assignments,
      ownDeliveries,
      leaderDeliveries,
    };
  },
};
