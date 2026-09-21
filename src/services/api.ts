/**
 * OmixFlow Hub API Client
 * Interfaces with OmixFlow Core Django REST Framework API (/api/v1/)
 * Features transparent fallback to seeded mock data for development.
 */

const API_BASE = 'http://localhost:8000/api/v1';

export interface Author {
  id: string | number;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  institution?: string;
  orcid_id?: string;
  is_verified_researcher?: boolean;
}

export interface AuthResponse {
  token: string;
  user: Author;
  profile?: any;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  institution?: string;
  orcid_id?: string;
  bio?: string;
}

export interface WorkflowSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  workflow_format: string;
  license: string;
  repository_url: string;
  zenodo_doi?: string;
  topics: string[];
  stars_count: number;
  forks_count: number;
  author_user?: Author;
  author_org?: { name: string; slug: string };
  latest_version_tag?: string;
  created_at: string;
}

export interface ComponentPort {
  id: string;
  name: string;
  port_type: 'INPUT' | 'OUTPUT';
  data_type: string;
  qualifier?: string;
  file_pattern?: string;
}

export interface SubcomponentStep {
  id: string;
  name: string;
  step_type: string;
  command_snippet: string;
  order_index: number;
}

export interface ComponentDetail {
  id: string;
  name: string;
  slug: string;
  description?: string;
  tool_name: string;
  tool_version: string;
  container_image: string;
  directives: Record<string, any>;
  script_interpreter: string;
  script_template: string;
  order_index: number;
  subcomponents: SubcomponentStep[];
  ports: ComponentPort[];
  discussion_threads_count: number;
}

export interface PostItem {
  id: string;
  author: Author;
  title: string;
  body_markdown: string;
  linked_workflow?: string;
  linked_workflow_details?: WorkflowSummary;
  paper_doi?: string;
  media_url?: string;
  tags: string[];
  likes_count: number;
  reposts_count: number;
  comments_count: number;
  is_liked?: boolean;
  created_at: string;
}

export interface DiscussionComment {
  id: string;
  author: Author;
  content_markdown: string;
  parent?: string;
  highlighted_by_author?: boolean;
  likes_count: number;
  replies_count: number;
  created_at: string;
}

export interface ConferenceItem {
  id: string;
  title: string;
  acronym: string;
  website_url: string;
  location: string;
  start_date: string;
  end_date: string;
  abstract_deadline?: string;
  topics: string[];
}

export interface WorkspaceItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  datasets_count: number;
  snippets_count: number;
  owner_user?: Author;
}

export interface DatasetItem {
  id: string;
  name: string;
  format: string;
  storage_uri: string;
  file_size_bytes: number;
  created_at: string;
}

export interface SnippetItem {
  id: string;
  title: string;
  language: string;
  code: string;
  description: string;
}

// ==============================================================================
// Seeded Fallback Mock Store
// ==============================================================================

const MOCK_AUTHOR_TAYLOR: Author = {
  id: '1',
  username: 'james_taylor',
  first_name: 'James',
  last_name: 'Taylor',
  institution: 'Broad Institute',
  orcid_id: '0000-0002-1825-0097',
  is_verified_researcher: true,
};

const MOCK_AUTHOR_MARIA: Author = {
  id: '2',
  username: 'maria_garcia',
  first_name: 'Maria',
  last_name: 'Garcia',
  institution: 'Wellcome Sanger Institute',
  orcid_id: '0000-0001-6543-9876',
  is_verified_researcher: true,
};

const MOCK_WORKFLOWS: WorkflowSummary[] = [
  {
    id: 'wf-1',
    name: 'GATK4 Germline SNPs & Indels',
    slug: 'gatk4-germline-snps-indels',
    description: 'Best Practices pipeline for germline short variant discovery from whole genome & exome sequencing.',
    workflow_format: 'Nextflow DSL2',
    license: 'BSD-3-Clause',
    repository_url: 'https://github.com/broadinstitute/gatk-workflows',
    zenodo_doi: '10.5281/zenodo.4312044',
    topics: ['WGS', 'Variant Calling', 'GATK4', 'HaplotypeCaller'],
    stars_count: 312,
    forks_count: 140,
    author_user: MOCK_AUTHOR_TAYLOR,
    author_org: { name: 'Broad Institute', slug: 'broad-institute' },
    latest_version_tag: 'v4.5.0',
    created_at: '2026-03-15T10:00:00Z',
  },
  {
    id: 'wf-2',
    name: 'nf-core/rnaseq',
    slug: 'nf-core-rnaseq',
    description: 'Automated end-to-end RNA sequencing pipeline using STAR, Salmon, FastQC, and DESeq2.',
    workflow_format: 'Nextflow DSL2',
    license: 'MIT',
    repository_url: 'https://github.com/nf-core/rnaseq',
    zenodo_doi: '10.5281/zenodo.1400710',
    topics: ['RNA-seq', 'Differential Expression', 'Salmon', 'STAR'],
    stars_count: 248,
    forks_count: 92,
    author_user: MOCK_AUTHOR_MARIA,
    author_org: { name: 'Wellcome Sanger Institute', slug: 'wellcome-sanger' },
    latest_version_tag: 'v3.14.0',
    created_at: '2026-02-20T14:30:00Z',
  },
  {
    id: 'wf-3',
    name: 'Single-Cell Multiome scRNA+scATAC',
    slug: 'single-cell-multiome',
    description: 'Joint processing of single-cell gene expression and chromatin accessibility using CellRanger-ARC.',
    workflow_format: 'Snakemake',
    license: 'MIT',
    repository_url: 'https://github.com/omixflow/sc-multiome',
    topics: ['Single-Cell', 'scRNA-seq', 'scATAC-seq', 'Epigenomics'],
    stars_count: 189,
    forks_count: 45,
    author_user: MOCK_AUTHOR_MARIA,
    author_org: { name: 'Wellcome Sanger Institute', slug: 'wellcome-sanger' },
    latest_version_tag: 'v2.1.0',
    created_at: '2026-04-10T09:15:00Z',
  },
];

const MOCK_POSTS: PostItem[] = [
  {
    id: 'post-1',
    author: MOCK_AUTHOR_TAYLOR,
    title: 'Nextflow 24.04 + GATK 4.5.0 Benchmark on 1,000 WGS Samples',
    body_markdown:
      'We completed a 1,000 deep-coverage WGS benchmark using our updated GATK4 pipeline. ' +
      'By replacing BWA-MEM with BWA-MEM2 and leveraging AWS Graviton3 instances, we achieved a ' +
      '34% reduction in compute cost with zero discordance in variant calls (R² > 0.999).',
    linked_workflow: 'wf-1',
    linked_workflow_details: MOCK_WORKFLOWS[0],
    paper_doi: '10.1038/s41587-020-0439-x',
    tags: ['benchmarking', 'GATK4', 'WGS', 'Nextflow'],
    likes_count: 84,
    reposts_count: 19,
    comments_count: 6,
    is_liked: false,
    created_at: '2 hours ago',
  },
  {
    id: 'post-2',
    author: MOCK_AUTHOR_MARIA,
    title: 'CellRanger-ARC v2.1.0 containerized modules now live on OmixFlow',
    body_markdown:
      'All subworkflows for multiome peak calling and clustering are now accessible on the Discover registry. ' +
      'Fully tested on both Slurm HPC (Singularity) and local Docker sandboxes.',
    linked_workflow: 'wf-3',
    linked_workflow_details: MOCK_WORKFLOWS[2],
    tags: ['Single-Cell', 'scRNA-seq', 'Reproducibility'],
    likes_count: 42,
    reposts_count: 8,
    comments_count: 3,
    is_liked: false,
    created_at: '6 hours ago',
  },
];

const MOCK_CONFERENCES: ConferenceItem[] = [
  {
    id: 'conf-1',
    acronym: 'ISMB 2027',
    title: '35th International Conference on Intelligent Systems for Molecular Biology',
    website_url: 'https://www.iscb.org/ismb2027',
    location: 'Geneva, Switzerland',
    start_date: '2027-07-11',
    end_date: '2027-07-15',
    abstract_deadline: '2027-01-28',
    topics: ['Bioinformatics', 'Machine Learning', 'Workflows', 'Genomics'],
  },
  {
    id: 'conf-2',
    acronym: 'BOSC 2027',
    title: 'Bioinformatics Open Source Conference',
    website_url: 'https://www.open-bio.org/events/bosc/',
    location: 'Geneva, Switzerland',
    start_date: '2027-07-16',
    end_date: '2027-07-17',
    abstract_deadline: '2027-03-01',
    topics: ['Open Source', 'Nextflow', 'Galaxy', 'Snakemake', 'Standards'],
  },
];

// ==============================================================================
// Exported API Functions
// ==============================================================================

export const api = {
  // --- Authentication & Session ---
  getAuthToken(): string | null {
    return localStorage.getItem('omixflow_token');
  },

  setAuthSession(data: AuthResponse) {
    localStorage.setItem('omixflow_token', data.token);
    localStorage.setItem('omixflow_user', JSON.stringify(data.user));
    if (data.profile) {
      localStorage.setItem('omixflow_profile', JSON.stringify(data.profile));
    }
    localStorage.setItem(
      'omixflow_role',
      data.is_superuser ? 'Consortium Director' : data.is_staff ? 'Staff' : 'Researcher'
    );
  },

  clearAuthSession() {
    localStorage.removeItem('omixflow_token');
    localStorage.removeItem('omixflow_user');
    localStorage.removeItem('omixflow_profile');
    localStorage.removeItem('omixflow_role');
  },

  getStoredUser(): Author | null {
    const item = localStorage.getItem('omixflow_user');
    return item ? JSON.parse(item) : null;
  },

  getStoredProfile(): any | null {
    const item = localStorage.getItem('omixflow_profile');
    return item ? JSON.parse(item) : null;
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to authenticate. Please check your credentials.');
    }
    const data: AuthResponse = await res.json();
    this.setAuthSession(data);
    return data;
  },

  async signup(payload: SignupPayload): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to register account. Please check your details.');
    }
    const data: AuthResponse = await res.json();
    this.setAuthSession(data);
    return data;
  },

  async getMe(): Promise<AuthResponse | null> {
    const token = this.getAuthToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          this.setAuthSession(data);
          return data;
        }
      }
    } catch (e) {
      console.warn('Backend offline, using stored session:', e);
    }
    const storedUser = this.getStoredUser();
    if (storedUser && token) {
      return {
        token,
        user: storedUser,
        profile: this.getStoredProfile(),
      };
    }
    return null;
  },

  async logout(): Promise<void> {
    const token = this.getAuthToken();
    if (token) {
      try {
        await fetch(`${API_BASE}/auth/logout/`, {
          method: 'POST',
          headers: { Authorization: `Token ${token}` },
        });
      } catch (err) {
        console.warn('Logout notification error:', err);
      }
    }
    this.clearAuthSession();
  },

  async getWorkflows(topic?: string, format?: string, search?: string): Promise<WorkflowSummary[]> {
    try {
      const params = new URLSearchParams();
      if (topic && topic !== 'All') params.append('topic', topic);
      if (format && format !== 'All') params.append('format', format.toLowerCase());
      if (search) params.append('q', search);

      const res = await fetch(`${API_BASE}/workflows/?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.results || data;
      }
    } catch (e) {
      console.warn('Using seeded fallback workflows:', e);
    }
    return MOCK_WORKFLOWS.filter((w) => {
      if (topic && topic !== 'All' && !w.topics.some((t) => t.toLowerCase() === topic.toLowerCase())) return false;
      if (search && !w.name.toLowerCase().includes(search.toLowerCase()) && !w.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  },

  async starWorkflow(slug: string): Promise<number> {
    try {
      const res = await fetch(`${API_BASE}/workflows/${slug}/star/`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        return data.stars_count;
      }
    } catch (e) {
      console.warn('Backend unavailable, updating local star count:', e);
    }
    const wf = MOCK_WORKFLOWS.find((w) => w.slug === slug);
    if (wf) {
      wf.stars_count += 1;
      return wf.stars_count;
    }
    return 0;
  },

  async getWorkflowDag(slug: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/workflows/${slug}/dag/`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Using local mock DAG:', e);
    }
    return {
      workflow_name: 'GATK4 Germline SNPs & Indels',
      version_tag: 'v4.5.0',
      components: [
        { id: 'bwa', name: 'BWA_MEM2', tool: 'bwa-mem2', container: 'quay.io/biocontainers/bwa-mem2:2.2.1', order: 1 },
        { id: 'sort', name: 'SAMTOOLS_SORT', tool: 'samtools', container: 'quay.io/biocontainers/samtools:1.20', order: 2 },
        { id: 'haplo', name: 'GATK_HAPLOTYPECALLER', tool: 'gatk4', container: 'broadinstitute/gatk:4.5.0.0', order: 3 },
      ],
      canvas_layout: {
        nodes: [
          { id: 'bwa', data: { label: 'BWA_MEM2' }, position: { x: 40, y: 80 } },
          { id: 'sort', data: { label: 'SAMTOOLS_SORT' }, position: { x: 240, y: 80 } },
          { id: 'haplo', data: { label: 'GATK_HAPLOTYPECALLER' }, position: { x: 440, y: 80 } },
        ],
        edges: [
          { id: 'e1', source: 'bwa', target: 'sort' },
          { id: 'e2', source: 'sort', target: 'haplo' },
        ],
      },
    };
  },

  async getComponentDetail(id: string): Promise<ComponentDetail> {
    try {
      const res = await fetch(`${API_BASE}/components/${id}/`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Using local mock component detail:', e);
    }
    return {
      id,
      name: 'GATK_HAPLOTYPECALLER',
      slug: 'gatk-haplotypecaller',
      description: 'Call germline SNPs and indels via local de-novo re-assembly of active haplotypes.',
      tool_name: 'gatk4',
      tool_version: '4.5.0.0',
      container_image: 'broadinstitute/gatk:4.5.0.0',
      directives: { cpus: 4, memory: '16.GB', time: '8.h' },
      script_interpreter: 'bash',
      script_template: 'gatk --java-options "-Xmx14g" HaplotypeCaller -R ${ref_fasta} -I ${input_bam} -O ${sample}.vcf.gz',
      order_index: 3,
      subcomponents: [
        { id: 's1', name: 'Verify Index', step_type: 'PRE_HOOK', command_snippet: 'test -f ${input_bam}.bai || samtools index ${input_bam}', order_index: 1 },
        { id: 's2', name: 'Invoke HaplotypeCaller', step_type: 'MAIN_COMMAND', command_snippet: 'gatk HaplotypeCaller -R ${ref_fasta} -I ${input_bam} -O output.vcf.gz', order_index: 2 },
      ],
      ports: [
        { id: 'p1', name: 'input_bam', port_type: 'INPUT', data_type: 'FILE', qualifier: 'path(input_bam)', file_pattern: '*.bam' },
        { id: 'p2', name: 'vcf_out', port_type: 'OUTPUT', data_type: 'FILE', file_pattern: '*.vcf.gz' },
      ],
      discussion_threads_count: 4,
    };
  },

  async getPosts(tag?: string): Promise<PostItem[]> {
    try {
      const url = tag ? `${API_BASE}/posts/?tag=${tag}` : `${API_BASE}/posts/`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data.results || data;
      }
    } catch (e) {
      console.warn('Using fallback posts:', e);
    }
    if (tag) {
      return MOCK_POSTS.filter((p) => p.tags.includes(tag));
    }
    return MOCK_POSTS;
  },

  async createPost(post: Partial<PostItem>): Promise<PostItem> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Token ${token}`;

    try {
      const res = await fetch(`${API_BASE}/posts/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(post),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Posting locally:', e);
    }
    const currentAuthor = this.getStoredUser() || MOCK_AUTHOR_TAYLOR;
    const newPost: PostItem = {
      id: `post-${Date.now()}`,
      author: currentAuthor,
      title: post.title || '',
      body_markdown: post.body_markdown || '',
      tags: post.tags || ['Genomics'],
      likes_count: 1,
      reposts_count: 0,
      comments_count: 0,
      created_at: 'Just now',
      paper_doi: post.paper_doi,
      linked_workflow: post.linked_workflow,
      linked_workflow_details: MOCK_WORKFLOWS.find((w) => w.id === post.linked_workflow),
    };
    MOCK_POSTS.unshift(newPost);
    return newPost;
  },

  async likePost(postId: string): Promise<{ liked: boolean; likes_count: number }> {
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/like/`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Liking locally:', e);
    }
    const post = MOCK_POSTS.find((p) => p.id === postId);
    if (post) {
      post.is_liked = !post.is_liked;
      post.likes_count += post.is_liked ? 1 : -1;
      return { liked: post.is_liked, likes_count: post.likes_count };
    }
    return { liked: true, likes_count: 1 };
  },

  async getPostComments(postId: string): Promise<DiscussionComment[]> {
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/comments/`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Fallback comments:', e);
    }
    return [
      {
        id: 'c1',
        author: MOCK_AUTHOR_MARIA,
        content_markdown: 'Did you evaluate accuracy across GC-rich genomic regions with this configuration?',
        likes_count: 3,
        replies_count: 1,
        created_at: '1 hour ago',
      },
      {
        id: 'c2',
        author: MOCK_AUTHOR_TAYLOR,
        content_markdown: 'Yes! Precision and recall both stayed above 99.8% in high-GC promoter regions.',
        highlighted_by_author: true,
        likes_count: 5,
        replies_count: 0,
        created_at: '45 mins ago',
      },
    ];
  },

  async addPostComment(postId: string, content: string): Promise<DiscussionComment> {
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/comments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_markdown: content }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Adding comment locally:', e);
    }
    return {
      id: `c-${Date.now()}`,
      author: MOCK_AUTHOR_TAYLOR,
      content_markdown: content,
      likes_count: 0,
      replies_count: 0,
      created_at: 'Just now',
    };
  },

  async getConferences(): Promise<ConferenceItem[]> {
    try {
      const res = await fetch(`${API_BASE}/conferences/`);
      if (res.ok) {
        const data = await res.json();
        return data.results || data;
      }
    } catch (e) {
      console.warn('Using fallback conferences:', e);
    }
    return MOCK_CONFERENCES;
  },

  async getWorkspaces(): Promise<WorkspaceItem[]> {
    try {
      const res = await fetch(`${API_BASE}/workspaces/`);
      if (res.ok) {
        const data = await res.json();
        return data.results || data;
      }
    } catch (e) {
      console.warn('Using fallback workspaces:', e);
    }
    return [
      {
        id: 'ws-1',
        name: 'Pan-Cancer WES Cohort',
        slug: 'pan-cancer-wes-cohort',
        description: 'Somatic mutation calling across 200 tumor-normal pairs.',
        datasets_count: 3,
        snippets_count: 4,
        owner_user: MOCK_AUTHOR_TAYLOR,
      },
    ];
  },

  async getWorkspaceDatasets(slug: string): Promise<DatasetItem[]> {
    try {
      const res = await fetch(`${API_BASE}/workspaces/${slug}/datasets/`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Using fallback datasets:', e);
    }
    return [
      { id: 'd1', name: 'NA12878_GIAB_WES.bam', format: 'BAM', storage_uri: 's3://omixflow-benchmarks/NA12878_WES.bam', file_size_bytes: 4831838208, created_at: '2026-03-18' },
      { id: 'd2', name: 'HCC1187_Tumor_R1.fastq.gz', format: 'FASTQ', storage_uri: 's3://omixflow-benchmarks/HCC1187_1.fq.gz', file_size_bytes: 2147483648, created_at: '2026-03-19' },
      { id: 'd3', name: 'GRCh38_Reference_FASTA.fa', format: 'FASTA', storage_uri: 's3://omixflow-references/GRCh38.fa', file_size_bytes: 3221225472, created_at: '2026-03-10' },
    ];
  },

  async getWorkspaceSnippets(slug: string): Promise<SnippetItem[]> {
    try {
      const res = await fetch(`${API_BASE}/workspaces/${slug}/snippets/`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Using fallback snippets:', e);
    }
    return [
      { id: 'sn-1', title: 'Extract Unmapped Reads', language: 'bash', code: 'samtools view -b -f 4 input.bam > unmapped.bam', description: 'Filter unmapped reads for downstream de-novo assembly.' },
      { id: 'sn-2', title: 'Calculate Ts/Tv Ratio', language: 'bash', code: "bcftools stats input.vcf.gz | grep 'TSTV' | awk '{print $NF}'", description: 'Evaluate transition/transversion ratio for whole exome QC.' },
    ];
  },
};
